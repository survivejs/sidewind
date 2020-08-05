# Sidewind - Tailwind but for state

**Sidewind** is a light (~4k minified) state management solution designed to work together with [Tailwind.css](https://tailwindcss.com) framework.

Sidewind was designed to add interactivity to small sites and it's not a replacement for a full-blown framework. That said, if you don't need much (i.e. routing), it can be enough.

By design, the approach follows the principle of **progressive enhancement** and your pages will be accessible without JavaScript.

## Directives

Sidewind is composed of a collection of directives that operate on the DOM. I've documented them in detail below.

### `x-state` and `x`

`x-state` is a state container and the state is often used by other directives. `x` is used for binding values. Consider the example below:

```html
<section x-state="false">Value: <span x="state" /></section>
```

The state can be manipulated using a global `setState`:

```html
<section x-state="false">
  <div class="mb-2">Value: <span x="state" /></div>
  <button class="btn btn-blue" onclick="setState(v => !v)">
    Toggle value
  </button>
</section>
```

State can be a complex object:

```html
<article x-state="{ amount: 1000, interest: 1.2 }">
  Total: <span x="state.amount * state.interest" />
</article>
```

> [The calculator example](#calculator) takes this idea further and shows how to handle user interaction.

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
      'p-2',
      state.target === 'https://survivejs.com' && 'bg-gray-400'
    ]"
    >Link target</a
  >
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
      <template x-each="todos">
        <li x="state.text"></li>
      </template>
    </ul>
  </div>
  <div x="JSON.stringify(state.todos, null, 2)"></div>
</div>
```

### `x-label`

`x-label` gives access to parent state and it's useful for sharing information between scopes in one direction.

```html
<div x-label="i18n" x-state="{ hello: 'Terve' }">
  <div x-state="{ world: 'World' }">
    <span x="i18n.hello + ' ' + state.world" />
  </div>
</div>
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
  Closest heading: <span x="state.closest.textContent" />
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
  Intersected at <span x="state.intersected" />
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
    <template x-each="cars">
      <li><span x="state.brand" /> - <span x="state.color" /></li>
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
    <template x-each="cars">
      <li><span x="state.brand" /> - <span x="state.color" /></li>
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
      <template x-each="todos">
        <li x="state.text" />
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
      { brand: 'Saab', color: 'gray' },
      { brand: 'Ferrari', color: 'red' },
      { brand: 'Porsche', color: 'silver' },
    ]
  }"
  class="table-fixed"
>
  <thead>
    <tr class="bg-gray-400">
      <td class="border p-2">Brand</td>
      <td class="border p-2">Color</td>
    </tr>
  </thead>
  <tbody>
    <template x-each="cars">
      <tr>
        <td class="border p-2" x="state.brand" />
        <td class="border p-2" x="state.color" />
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
    <div
      x-class="[
        'py-2',
        'text-gray-600',
        !state && 'hidden'
      ]"
    >
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
    <div
      x-class="[
        'py-2',
        'text-gray-600',
        !state && 'hidden'
      ]"
    >
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
      x-class="[
        'p-2',
        'w-full',
        state === 'animals' ? 'bg-gray-400' : 'btn-muted'
      ]"
      onclick="setState('animals')"
    >
      Animals
    </div>
    <div
      x-class="[
        'p-2',
        'w-full',
        state === 'languages' ? 'bg-gray-400' : 'btn-muted'
      ]"
      onclick="setState('languages')"
    >
      Languages
    </div>
    <div
      x-class="[
        'p-2',
        'w-full',
        state === 'colors' ? 'bg-gray-400' : 'btn-muted'
      ]"
      onclick="setState('colors')"
    >
      Colors
    </div>
  </nav>
  <div class="bg-gray-100 p-2">
    <div x-class="state !== 'animals' && 'hidden'">
      Animals tab
    </div>
    <div x-class="state !== 'languages' && 'hidden'">
      Languages tab
    </div>
    <div x-class="state !== 'colors' && 'hidden'">
      Colors tab
    </div>
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
    <template x-each="headings">
      <li>
        <a
          x-href="state.nextElementSibling.attributes.href.value"
          x="state.textContent"
          x-class="[
            state.textContent === parent.closest.textContent && 'font-bold',
            state.tagName === 'H3' && 'ml-2'
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
      }, this))"
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

## Usage

### Local Use

For now, the easiest way to use Sidewind is to import it to a bootstrap script: `import "sidewind";`.

Doing this will activate all included directives and expose `setState` in the global scope.

By design, Sidewind is modular and it's possible it will be packaged in a different way in the future so you get only the functionality you want. There's also room for tooling here as it's possible to write a preprocessor that can figure out the right imports based on use per page.

### Online Use

To allow for easy online usage with all functionality, there are versions of Sidewind designed for this purpose - `tailwind/sidewind.umd.development.js` and `sidewind.umd.production.min.js`. Both include everything and runs the script above.

**Example:**

<code class="overflow-auto max-w-full inline-block">
  <script type="text/javascript" src="https://unpkg.com/sidewind@1.2.1/dist/sidewind.umd.production.min.js" />
</code>

## Directive API

All directives of the system have been implemented as plugins. For now, it's best to examine the framework source to see how it all goes together.

## Related Approaches

- [Alpine.js](https://github.com/alpinejs/alpine) provides a similar yet more broad API closer to Angular than Sidewind.
- [amp-bind](https://amp.dev/documentation/components/amp-bind/) implementes data binding and expressions.
- [Mavo](https://mavo.io) implements a DSL on top of HTML for light interactivity.
- [Svelte](https://svelte.dev) implements a compiler based approach.
- [Vue](https://vuejs.org), and especially Vue 3, allows similar usage in the frontend as Sidewind.

## License

MIT.
