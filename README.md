# Sidewind - Tailwind but for state

**Sidewind** is a light (~4k minified) state management solution designed to work together with [Tailwind.css](https://tailwindcss.com) framework.

Sidewind was designed to add interactivity to small sites and it's not a replacement for a full-blown framework. That said, if you don't need much (i.e. routing), it can be enough.

By design, the approach follows the principle of **progressive enhancement** and your pages will be accessible without JavaScript.

## Directives

Sidewind is composed of a collection of directives that operate on the DOM. I've documented them in detail below.

### `x-state` and `x`

`x-state` is a state container and the state is often used by other directives. `x` is used for binding values. Consider the example below:

```html
<section x-state="false">Value: <span x="state"></span></section>
```

The state can be manipulated using a global `setState`:

```html
<section x-state="false">
  <div class="mb-2">Value: <span x="state"></span></div>
  <button class="btn btn-blue" onclick="setState(v => !v)">Toggle value</button>
</section>
```

State can be a complex object:

```html
<article x-state="{ amount: 1000, interest: 1.2 }">
  Total: <span x="state.amount * state.interest" />
</article>
```

> [The calculator example](#calculator) takes this idea further and shows how to handle user interaction.

### `x-cloak`

`x-cloak` has been designed let you hide interactive content until Sidewind has loaded to avoid displaying markup that's not ready. Consider the example below:

```html
<article hidden x-cloak x-state="{ amount: 1000, interest: 1.2 }">
  Total: <span x="state.amount * state.interest" />
</article>
```

When it executes, it removes the [hidden](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/hidden) attribute from the element and it will be ready to run.

### `x` with Attributes

In addition to binding values, it's possible to bind attributes with `x-`:

```html
<section x-state="{ target: 'https://survivejs.com' }">
  <a x-href="state.target">Link target</a>
</section>
```

For classes, it's possible to pass an array to evaluate to produce multiple classes based on expressions:

```html
<section x-state="{ target: 'https://survivejs.com' }">
  <a
    x-href="state.target"
    x-class="[
      state.target === 'https://google.com' && 'bg-red-400',
      state.target === 'https://survivejs.com' && 'bg-gray-400'
    ]"
    >Link target</a
  >
</section>
```

Default classes are retained as this allows more compact syntax with a fallback:

```html
<section x-state="{ target: 'https://survivejs.com' }">
  <a
    class="p-2"
    x-class="state.target === 'https://survivejs.com' && 'bg-gray-400'"
    x-href="state.target"
    >Link target</a
  >
  <button
    class="btn btn-blue"
    onclick="setState({ target: 'https://google.com' })"
  >
    Change target
  </button>
</section>
```

### `x-each`

`x-each` allows iteration of a list. It has been designed to be used with a [template tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template).

```html
<div
  x-state="{
    todos: [
      { text: 'Wash dishes' }, { text: 'Eat carrots' }
    ]
  }"
>
  <div class="mb-2">
    <ul class="list-disc list-inside">
      <template x-each="state.todos">
        <li x="state.value.text"></li>
      </template>
    </ul>
  </div>
  <div x="JSON.stringify(state.todos, null, 2)"></div>
</div>
```

Each child of the template has access to the state of the current item.

```html
<div
  x-state="{
    todos: [
      { type: 'Chore', text: 'Wash dishes' },
      { type: 'Food', text: 'Eat carrots' }
    ]
  }"
>
  <div class="mb-2">
    <ul class="list-disc list-inside">
      <template x-each="state.todos">
        <li>
          <span x="state.value.type"></span> -
          <span x="state.value.text"></span>
        </li>
      </template>
    </ul>
  </div>
  <div x="JSON.stringify(state.todos, null, 2)"></div>
</div>
```

Same goes for sibling items.

```html
<div
  x-state="{
    todos: [
      { type: 'Chore', text: 'Wash dishes' },
      { type: 'Food', text: 'Eat carrots' }
    ]
  }"
>
  <div class="mb-2">
    <ul class="list-disc list-inside">
      <template x-each="state.todos">
        <li x="state.value.type"></li>
        <li x="state.value.text"></li>
      </template>
    </ul>
  </div>
  <div x="JSON.stringify(state.todos, null, 2)"></div>
</div>
```

Iterated items can also have inputs while focus is retained on edit.

```html
<div
  x-state="{
    title: 'Demo',
    description: 'x-each demo'
  }"
  oninput="setState(state => ({
    ...state,
    [event.target.dataset.field]: event.target.value
  }), { element: this })"
>
  <div class="mb-2">
    <ul class="list-disc list-inside">
      <template x-each="Object.entries(state)">
        <li>
          <label>
            Field:
            <input
              type="text"
              x-data-field="state.value[0]"
              x="state.value[1]"
              oninput="setState({ value: [this.dataset.field, this.value] })"
            />
          </label>
        </li>
      </template>
    </ul>
  </div>
  <div x="JSON.stringify(state, null, 2)"></div>
</div>
```

`x-each` state can be updated indirectly.

```html
<div
  class="flex flex-col gap-2"
  x-state="{
    todos: [
      { text: 'Wash dishes', selected: false }, { text: 'Eat carrots', selected: false }
    ]
  }"
>
  <div class="mb-2">
    <ul class="list-disc list-inside">
      <template x-each="state.todos">
        <li
          x-class="state.value.selected && 'font-bold'"
          x="state.value.text"
        ></li>
      </template>
    </ul>
  </div>
  <div x="JSON.stringify(state.todos, null, 2)"></div>
  <div class="flex gap-2">
    <button
      class="btn btn-blue"
      onclick="setState(({ todos }) => ({ todos: [{ ...todos[0], selected: true }].concat(todos.slice(1)) }))"
    >
      Select first
    </button>
    <button
      class="btn btn-blue"
      onclick="setState(({ todos }) => ({ todos: [{ text: 'New item', selected: false }].concat(todos) }))"
    >
      Add item to the beginning
    </button>
    <button
      class="btn btn-blue"
      onclick="setState(({ todos }) => ({ todos: todos.concat({ text: 'New item', selected: false }) }))"
    >
      Add item to the end
    </button>
    <button
      class="btn btn-blue"
      onclick="setState(({ todos }) => ({ todos: todos.slice(0, -1) }))"
    >
      Remove item from the end
    </button>
    <button
      class="btn btn-blue"
      onclick="setState(({ todos }) => ({ todos: todos.slice(1) }))"
    >
      Remove item from the beginning
    </button>
  </div>
</div>
```

It's possible to render lists inside lists.

```html
<div
  class="flex flex-col gap-2"
  x-state="{
    initial: [
      {
        text: 'Wash dishes',
        children: [
          {
            text: 'Wash forks',
            children: [
              {
                text: 'Wash tiny forks'
              }
            ]
          },
          { text: 'Wash plates', children: 'testing' }
        ]
      },
      { text: 'Eat carrots', children: [
        { text: 'Chew', children: 'foo' },
        { text: 'Swallow', children: 'bar' }
      ] }
    ],
    show: [
      { text: 'Eat carrots', children: [
        { text: 'Chew', children: 'foo' },
        { text: 'Swallow', children: 'bar' }
      ] }
    ],
    done: [
      {
        text: 'Wash cups'
      }
    ],
  }"
>
  <div>
    <ul class="list-disc list-inside">
      <template x-each="state.show">
        <li>
          <span x="state.value.text"></span>
          <ul class="list-disc list-inside ml-2">
            <template x-each="state.value.children">
              <li>
                <span x="state.value.text"></span>
              </li>
            </template>
          </ul>
        </li>
      </template>
    </ul>
  </div>
  <div x="JSON.stringify(state.show, null, 2)"></div>
  <div>
    <button
      class="btn btn-blue"
      onclick="setState(({ initial }) => ({ show: initial }))"
    >
      Replace state with initial
    </button>
  </div>
  <div>
    <button
      class="btn btn-blue"
      onclick="setState(({ done }) => ({ show: done }))"
    >
      Replace state with done
    </button>
  </div>
</div>
```

### `x-recurse`

It is also possible to apply `x-each` recursively using `x-recurse`. It will find the nearest `x-each` and then apply it using the given state. To allow styling, `x-each` injects a `level` property to each item based on the depth of recursion.

```html
<div
  class="flex flex-col gap-2"
  x-state="{
    initial: [
      {
        text: 'Wash dishes',
        children: [
          {
            text: 'Wash forks',
            children: [
              {
                text: 'Wash tiny forks'
              }
            ]
          },
          { text: 'Wash plates', children: 'testing' }
        ]
      },
      { text: 'Eat carrots', children: [
        { text: 'Chew', children: 'foo' },
        { text: 'Swallow', children: 'bar' }
      ] }
    ],
    show: [
      { text: 'Eat carrots', children: [
        { text: 'Chew', children: 'foo' },
        { text: 'Swallow', children: 'bar' }
      ] }
    ],
    done: [
      {
        text: 'Wash cups'
      }
    ],
  }"
>
  <div>
    <ul class="list-disc list-inside">
      <template x-each="state.show">
        <li x-class="state.level > 0 && 'ml-2'">
          <span x="state.value.text"></span>
          <ul
            class="list-disc list-inside"
            x-recurse="state.value.children"
          ></ul>
        </li>
      </template>
    </ul>
  </div>
  <div x="JSON.stringify(state.show, null, 2)"></div>
  <div>
    <button
      class="btn btn-blue"
      onclick="setState(({ initial }) => ({ show: initial }))"
    >
      Replace state with initial
    </button>
  </div>
  <div>
    <button
      class="btn btn-blue"
      onclick="setState(({ done }) => ({ show: done }))"
    >
      Replace state with done
    </button>
  </div>
</div>
```

### `x-label`

`x-label` gives access to parent state and it's useful for sharing information between scopes.

```html
<div x-label="i18n" x-state="{ hello: 'Terve' }">
  <div x-state="{ world: 'World' }">
    <span x="i18n.hello + ' ' + state.world" />
  </div>
</div>
```

It's also possible to set the parent state within a child. This allows you to nest state within state while being able to mutate it.

```html
<div x-label="parent" x-state="'parent state'">
  <div>Parent state in between: <span x="parent" /></div>
  <div class="space-y-2" x-state="'child state'">
    <div>Parent state: <span x="parent" /></div>
    <div>Child state: <span x="state" /></div>
    <button
      class="btn btn-blue"
      onclick="setState('Changed parent', { parent: 'parent' })"
    >
      Change parent state
    </button>
    <button class="btn btn-blue" onclick="setState('Changed child')">
      Change child state
    </button>
    <button
      class="btn btn-blue"
      onclick="setState('Changed both') || setState('Changed both', { parent: 'parent' })"
    >
      Change both
    </button>
  </div>
</div>
```

The nested behavior works for attributes as well.

```html
<div x-label="parent" x-state="true">
  <div class="space-y-2" x-state="true">
    <div class="p-2" x-class="parent ? 'bg-red-400' : 'bg-red-200'">Parent</div>
    <div class="p-2" x-class="state ? 'bg-gray-400' : 'bg-gray-200'">Child</div>
    <div class="flex space-x-2">
      <button
        class="btn btn-blue"
        onclick="setState(state => !state, { parent: 'parent' })"
      >
        Change parent class
      </button>
      <button class="btn btn-blue" onclick="setState(state => !state)">
        Change child class
      </button>
      <button
        class="btn btn-blue"
        onclick="setState(state => !state) || setState(state => !state, { parent: 'parent' })"
      >
        Change classes for both
      </button>
    </div>
  </div>
</div>
```

The labeled data is available at `x-each` as well:

```html
<div x-label="parent" x-state="{ message: 'Hello' }">
  <div
    x-state="{
    todos: [
      { text: 'Wash dishes' }, { text: 'Eat carrots' }
    ]
  }"
  >
    <div class="mb-2">
      <ul class="list-disc list-inside">
        <template x-each="state.todos">
          <li x="parent.message + ': ' + state.value.text"></li>
        </template>
      </ul>
    </div>
    <div x="JSON.stringify(state.todos, null, 2)"></div>
  </div>
</div>
```

State can also be derived to compose or enhance it.

```html
<section x-label="parent" x-state="{ name: 'Hello' }">
  <div>Value: <span x="state.name"></span></div>
  <div x-state="{ longerName: parent.name + ' again' }">
    <div>Value: <span x="state.longerName"></span></div>
  </div>
</section>
```

## Sources

Sources wrap browser state within a reactive stream that's then mapped to a state.

### `x-closest`

`x-closest` gives you access to the element closest to display top within the selected elements:

```html
<div
  x-state="{ closest: '' }"
  x-closest="{
    state: { closest: document.querySelectorAll('h2, h3') }
  }"
>
  Closest heading: <span x="state.closest.textContent"></span>
</div>
```

### `x-intersect`

`x-intersect` triggers when the element is visible at the viewport. See [IntersectionObserver documentation](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/IntersectionObserver) for available options.

```html
<div
  x-state="{ intersected: '' }"
  x-intersect="{
    state: { intersected: new Date().toString() }
  }"
>
  Intersected at <span x="state.intersected"></span>
</div>
```

In addition to the standard options, there's an `once` flag that when set causes the state to be set only once. The behavior is useful for implementing patterns such as lazy loading.

```html
<div x-state="{ src: '' }">
  <img
    x-intersect="{
      options: { once: true },
      state: { src: './assets/logo.png' }
    }"
    x-src="state.src"
  />
</div>
```

### `x-interval`

`x-interval` wraps [setInterval](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval) and exposes its `delay` parameters. When triggered, it sets state.

```html
<div
  x-state="{ time: '' }"
  x-interval="{
    options: { delay: 1000 },
    state: { time: new Date().toString() }
  }"
>
  <span class="font-bold">Current time:</span> <span x="state.time" />
</div>
```

### `x-promise`

It's possible to use the standard [fetch() API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) on top of `x-promise` to handle data requests:

```html
<div
  x-state="{ cars: [] }"
  x-promise="{
    state: {
      cars: fetch('./assets/cars.json').then(res => res.json())
    }
  }"
>
  <ul class="list-disc list-inside">
    <template x-each="state.cars">
      <li>
        <span x="state.value.brand"></span> -
        <span x="state.value.color"></span>
      </li>
    </template>
  </ul>
</div>
```

In case there's an error, then the `Error` object is emitted to `error` state:

```html
<div
  x-state="{ cars: [], error: {} }"
  x-promise="{
    state: {
      cars: fetch('./assets/404.json').then(res => res.json())
    }
  }"
>
  <div x="state.error.message" />
  <ul class="list-disc list-inside">
    <template x-each="state.cars">
      <li>
        <span x="state.value.brand"></span> -
        <span x="state.value.color"></span>
      </li>
    </template>
  </ul>
</div>
```

## Examples

The examples below combine directives to produce complex user interfaces and to handle specific use cases.

### Calculator

```html
<article
  class="flex flex-col md:flex-row justify-between md:max-w-md"
  x-state="{
    amount: 1000,
    interest: 1.2
  }"
>
  <div class="mb-2">
    <label for="amount">Amount</label>
    <input
      id="amount"
      type="text"
      oninput="setState({ amount: this.value })"
      x="state.amount"
    />
  </div>
  <div class="mb-2">
    <label for="interest">Interest</label>
    <input
      id="interest"
      type="text"
      oninput="setState({ interest: this.value
    })"
      x="state.interest"
    />
  </div>
  <div>
    Total: <span x="Math.round(state.amount * state.interest * 100) / 100" />
  </div>
</article>
```

### TODO List

```html
<form
  x-state="{ text: '', todos: [] }"
  onsubmit="setState({
    text: '',
    todos: this.state.todos.concat({
      text: this.state.text
    })
  })"
  action="javascript:"
>
  <div class="mb-2">
    <label class="mr-2">
      <span>Add Todo</span>
      <input
        id="text"
        type="text"
        oninput="setState({ text: this.value })"
        x="state.text"
      />
    </label>
    <button class="btn btn-blue" type="submit">Add</button>
  </div>
  <div class="mb-2">
    <ul class="list-disc list-inside">
      <template x-each="state.todos">
        <li x="state.value.text" />
      </template>
    </ul>
  </div>
  <div x="JSON.stringify(state.todos, null, 2)"></div>
</form>
```

### Table

```html
<table
  x-state="{
    cars: [
      { brand: 'Saab', speed: 'fast' },
      { brand: 'Ferrari', speed: 'faster' },
      { brand: 'Porsche', speed: 'fastest' },
    ]
  }"
  class="table-fixed"
>
  <thead>
    <tr class="bg-gray-400">
      <td class="border p-2">Brand</td>
      <td class="border p-2">Speed</td>
    </tr>
  </thead>
  <tbody>
    <template x-each="state.cars">
      <tr>
        <td class="border p-2" x="state.value.brand" />
        <td class="border p-2" x="state.value.speed" />
      </tr>
    </template>
  </tbody>
</table>
```

### Accordion

```html
<section>
  <div class="mb-2" x-state="false">
    <div
      class="flex flex-row justify-between cursor-pointer"
      onclick="setState(visible => !visible)"
    >
      <span>Junior Engineer</span>
      <span x="state ? '+' : '-'" />
    </div>
    <div class="py-2 text-gray-600" x-class="!state && 'hidden'">
      Junior engineer description
    </div>
  </div>
  <hr class="my-2" />
  <div x-state="false">
    <div
      class="flex flex-row justify-between cursor-pointer"
      onclick="setState(visible => !visible)"
    >
      <span>Senior Engineer</span>
      <span x="state ? '+' : '-'" />
    </div>
    <div class="py-2 text-gray-600" x-class="!state && 'hidden'">
      Senior engineer description
    </div>
  </div>
</section>
```

### Tabs

```html
<section x-state="'animals'">
  <nav class="flex flex-row justify-between cursor-pointer">
    <div
      class="p-2 w-full"
      x-class="state === 'animals' ? 'bg-gray-400' : 'btn-muted'"
      onclick="setState('animals')"
    >
      Animals
    </div>
    <div
      class="p-2 w-full"
      x-class="state === 'languages' ? 'bg-gray-400' : 'btn-muted'"
      onclick="setState('languages')"
    >
      Languages
    </div>
    <div
      class="p-2 w-full"
      x-class="state === 'colors' ? 'bg-gray-400' : 'btn-muted'"
      onclick="setState('colors')"
    >
      Colors
    </div>
  </nav>
  <div class="bg-gray-100 p-2">
    <div x-class="state === 'animals' ? '' : 'hidden'">Animals tab</div>
    <div x-class="state === 'languages' ? '' : 'hidden'">Languages tab</div>
    <div x-class="state === 'colors' ? '' : 'hidden'">Colors tab</div>
  </div>
</section>
```

### Table of Contents

```html
<nav
  x-label="parent"
  x-state="{
    closest: {},
    headings: Array.from(document.querySelectorAll('h2, h3'))
  }"
  x-closest="{
    state: { closest: document.querySelectorAll('h2, h3') }
  }"
>
  <ul>
    <template x-each="state.headings">
      <li>
        <a
          x-href="state.value.nextElementSibling?.attributes.href.value"
          x="state.value.textContent"
          x-class="[
            state.value.textContent === parent.closest?.textContent && 'font-bold',
            state.value.tagName === 'H3' && 'ml-2'
          ]"
        >
        </a>
      </li>
    </template>
  </ul>
</nav>
```

### Loading a Partial

```html
<div x-state="{ status: 'pending', partial: '' } ">
  <button
    onmouseover="setState({ status: 'loading' });
    fetch('./assets/partial.html')
      .then(res => res.text())
      .then(partial => setState({
        partial, status: 'loaded'
      }, { element: this }))"
  >
    Show Partial
  </button>
  <div>
    <span x="state.status === 'loading' ? 'Loading...' : ''"></span>
    <span x="state.partial"></span>
  </div>
</div>
```

### Code Editor

```html
<div class="flex font-mono relative" x-state="'console.log(\'demo\')'">
  <pre x="highlight('js', state)"></pre>
  <textarea
    class="absolute min-w-full top-0 left-0 outline-none opacity-25 bg-none"
    oninput="setState(this.value)"
    x="state"
    autocapitalize="off"
    autocomplete="off"
    autocorrect="off"
    spellcheck="false"
  ></textarea>
</div>
```

## Programmatic API

For now, the easiest way to use Sidewind is to import it to a bootstrap script: `import "sidewind";`.

Doing this will activate all included directives and expose the following API in the global scope:

- `getState(element: HTMLElement)` - Returns state found in the parents of the given element
- `setState(State | (state: State) => State, { element?: HTMLElement, parent?: string } )` - Sets state in the given element. If parent is given, then the state will be applied based on the label (see `x-label`).
- `evaluateAllDirectives()` - Evaluates all directives installed to the system. This can be useful if you are integrating Sidewind to an external system and want to trigger evaluation on load for example.

By design, Sidewind is modular and it's possible it will be packaged in a different way in the future so you get only the functionality you want. There's also room for tooling here as it's possible to write a preprocessor that can figure out the right imports based on use per page.

> All directives of the system have been implemented as plugins. For now, it's best to examine the framework source to see how it all goes together.

## Online Use

To allow for easy online usage with all functionality, there are versions of Sidewind designed for this purpose - `tailwind/sidewind.umd.development.js` and `sidewind.umd.production.min.js`. Both include everything and runs the script above.

**Example:**

> `<script type="text/javascript" src="https://unpkg.com/sidewind@5.3.0/dist/sidewind.umd.production.min.js"></script>`

## Related Approaches

- [Alpine.js](https://github.com/alpinejs/alpine) provides a similar yet more broad API closer to Angular than Sidewind.
- [amp-bind](https://amp.dev/documentation/components/amp-bind/) implements data binding and expressions.
- [htmx](https://htmx.org/) is a complete solution with server integration.
- [Mavo](https://mavo.io) implements a DSL on top of HTML for light interactivity.
- [Svelte](https://svelte.dev) implements a compiler based approach.
- [Vue](https://vuejs.org), and especially Vue 3, allows similar usage in the frontend as Sidewind. See also [petite-vue](https://github.com/vuejs/petite-vue).

## License

MIT.
