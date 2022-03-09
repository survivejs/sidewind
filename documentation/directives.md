---
slug: "directives"
---

# Directives

Sidewind is composed of a collection of directives that operate on the DOM. I've documented them in detail below.

## `x-state` and `x`

`x-state` is a state container and the state is often used by other directives. `x` is used for binding values. Consider the example below:

```html
<section x-state="false">Value: <span x="state"></span></section>
```

The state can be manipulated using a global `setState`:

```html
<section x-state="false">
  <div class="prose mb-2">Value: <span x="state"></span></div>
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

## `x-cloak`

`x-cloak` has been designed let you hide interactive content until Sidewind has loaded to avoid displaying markup that's not ready. Consider the example below:

```html
<article hidden x-cloak x-state="{ amount: 1000, interest: 1.2 }">
  Total: <span x="state.amount * state.interest" />
</article>
```

When it executes, it removes the [hidden](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/hidden) attribute from the element and it will be ready to run.

## `x-attr`

In addition to binding values, it's possible to bind attributes with `x-attr`:

```html
<section x-state="{ target: 'https://survivejs.com' }">
  <a x-attr @href="state.target">Link target</a>
</section>
```

The idea is that `x-attr` tells Sidewind that there are bindings and then `@` is used to signify which. Using the keyword is a small optimization and it also makes it easier to find spots in code where you might have attribute bindings in place.

For classes, it's possible to pass an array to evaluate to produce multiple classes based on expressions:

```html
<section x-state="{ target: 'https://survivejs.com' }">
  <a
    x-attr
    @href="state.target"
    @class="[
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
    x-attr
    class="p-2"
    @class="state.target === 'https://survivejs.com' && 'bg-gray-400'"
    @href="state.target"
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

## `x-each` and `x-template`

`x-each` allows iteration of a list and it has been designed with server-side rendering (SSR) mind so that you can display initial data without JavaScript enabled.

`x-each` connects to an array and then `x-template` is used to mark how to render each item of it while iterating.

```html
<div
  x-state="{
    todos: [
      { text: 'Wash dishes' }, { text: 'Eat carrots' }
    ]
  }"
>
  <div class="mb-2">
    <ul class="list-disc list-inside" x-each="state.todos">
      <li x-template x="state.value.text"></li>
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
    <ul class="list-disc list-inside" x-each="state.todos">
      <li x-template>
        <span x="state.value.type"></span> -
        <span x="state.value.text"></span>
      </li>
    </ul>
  </div>
  <div x="JSON.stringify(state.todos, null, 2)"></div>
</div>
```

Same goes for sibling items. Note how multiple templates are grouped together.

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
    <ul class="list-disc list-inside" x-each="state.todos">
      <li x-template="group" x="state.value.type"></li>
      <li x-template="group" x="state.value.text"></li>
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
    <ul class="list-disc list-inside" x-each="Object.entries(state)">
      <li x-template>
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
    <ul class="list-disc list-inside" x-each="state.todos">
      <li
        x-template
        x="state.value.text"
        x-attr
        @class="state.value.selected && 'font-bold'"
      ></li>
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
    <ul class="list-disc list-inside" x-each="state.show">
      <li x-template>
        <span x="state.value.text"></span>
        <ul class="list-disc list-inside ml-2">
          <template x-each="state.value.children">
            <li>
              <span x="state.value.text"></span>
            </li>
          </template>
        </ul>
      </li>
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

`x-each` also works with complex objects.

```html
<div
  x-state="{
    dataSources: [
      {
        id: 'readme',
        operation: 'file',
        input: './README.md',
        transformWith: 'markdown'
      }
    ]
  }"
>
  <div class="mb-2">
    <ul class="list-disc list-inside" x-each="state.dataSources">
      <li x-template="group" x="state.value.id + ' : ' + state.value.operation"></li>
      <li x-template="group" x="JSON.stringify(state, null, 2)"></li>
    </ul>
  </div>
  <div x="JSON.stringify(state.dataSources, null, 2)"></div>
  <div>
    <button
      class="btn btn-blue"
      onclick="setState(({ dataSources }) => ({ dataSources }))"
    >
      Replace state
    </button>
  </div>
</div>
```

`x-each` also works with even more complex objects.

```html
<div
  x-state="{
    dataSources: [
      {
        id: 'readme',
        operation: 'file',
        input: './README.md',
        transformWith: [
          {
            name: 'markdown'
          },
          {
            name: 'reverse'
          }
        ]
      }
    ]
  }"
>
  <div class="mb-2">
    <ul class="list-disc list-inside" x-each="state.dataSources">
        <li x-template="group" x="state.value.id"></li>
        <li x-template="group" x="JSON.stringify(state, null, 2)"></li>
        <ul x-template="group" x-each="state.value.transformWith">
          <li x="state.value.name"></li>
        </ul>
    </ul>
  </div>
  <div x="JSON.stringify(state.dataSources, null, 2)"></div>
  <div>
    <button
      class="btn btn-blue"
      onclick="setState(({ dataSources }) => ({ dataSources }))"
    >
      Replace state
    </button>
    <button
      class="btn btn-blue"
      onclick="setState(() => ({ greeting: 'hello' }))"
    >
      Set unrelated state I
    </button>
    <button class="btn btn-blue" onclick="setState({ greeting: 'ohai' })">
      Set unrelated state II
    </button>
  </div>
</div>
```

`x-each` also works with state derived from `x-each`.

```html
<div
  x-state="{
    dataSources: [
      {
        id: 'readme',
        operation: 'file',
        input: './README.md',
        transformWith: {
          name: 'markdown',
          operation: 'transform'
        }
      }
    ]
  }"
>
  <div class="mb-2">
    <ul class="list-disc list-inside" x-each="state.dataSources">
      <li x-template="group" x="state.value.id"></li>
      <li x-template="group" x="JSON.stringify(state, null, 2)"></li>
      <ul x-template="group" class="ml-2 list-disc list-inside" x-each="Object.entries(state.value.transformWith)">
        <li x-template>
          <span x="state.value[0]"></span> -
          <span x="state.value[1]"></span>
        </li>
      </ul>
    </ul>
  </div>
  <div x="JSON.stringify(state.dataSources, null, 2)"></div>
  <div>
    <button
      class="btn btn-blue"
      onclick="setState(({ dataSources }) => ({ dataSources }))"
    >
      Replace state
    </button>
    <button
      class="btn btn-blue"
      onclick="setState(() => ({ greeting: 'hello' }))"
    >
      Set unrelated state I
    </button>
    <button class="btn btn-blue" onclick="setState({ greeting: 'ohai' })">
      Set unrelated state II
    </button>
  </div>
</div>
```

## `x-template` and SSR

`x-each` supports server-side rendering (SSR) out of the box (better SEO without JS enabled). In this case, you should take care to populate the state and adjacent elements with the same state (here different content is used for the sake of testing). The elements marked with `x-template` will be removed when `x-each` mounts and it will use the first one as the template.

```html
<div
  x-state="{
    todos: [
      { text: 'Wash dishes' }, { text: 'Eat carrots' }
    ]
  }"
>
  <div class="mb-2">
    <ul class="list-disc list-inside" x-each="state.todos">
      <li x-template x="state.value.text">Wash dishes (SSR)</li>
      <li x-template x="state.value.text">Eat carrots (SSR)</li>
    </ul>
  </div>
  <div x="JSON.stringify(state.todos, null, 2)"></div>
</div>
```

The example above would work even if you remove the latter `x="state.value.text"` but it can be easier to generate the full form from a site generator.

The caveat of the current approach is that it doesn't allow expansion to multiple templates at once but support this could be added by using a different type of syntax and then adapting to that.

## `x-recurse`

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
    <ul class="list-disc list-inside" x-each="state.show">
      <li x-template x-attr @class="state.level > 0 && 'ml-2'">
        <span x="state.value.text"></span>
        <ul
          class="list-disc list-inside"
          x-recurse="state.value.children"
        ></ul>
      </li>
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

## `x-label`

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
    <div x-attr class="p-2" @class="parent ? 'bg-red-400' : 'bg-red-200'">
      Parent
    </div>
    <div x-attr class="p-2" @class="state ? 'bg-gray-400' : 'bg-gray-200'">
      Child
    </div>
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
      <ul class="list-disc list-inside" x-each="state.todos">
        <li x-template x="parent.message + ': ' + state.value.text"></li>
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
    <button
      class="btn btn-blue mb-2"
      onclick="setState({ name: 'Hi' }, { parent: 'parent' })"
    >
      Change to hi from within
    </button>
  </div>
  <button class="btn btn-blue" onclick="setState({ name: 'Morning' })">
    Change to morning
  </button>
  <button class="btn btn-blue" onclick="setState({ name: 'Goodbye' })">
    Change to goodbye
  </button>
</section>
```

The same works with the JavaScript API.

```html
<section x-label="parent" x-state="{ name: 'Hello' }">
  <div x-label="child" x-state="{ value: 'you' }">
    <div>Value: <span x="parent.name"></span></div>
    <div x-state="{ longerName: parent.name + ' ' + child.value }">
      <div>Value: <span x="state.longerName"></span></div>
      <button class="btn btn-blue mb-2" onclick="hiClicked(this)">
        Change to hi from within
      </button>
      <button class="btn btn-blue mb-2" onclick="bothClicked(this)">
        Change both from within
      </button>
      <button
        class="btn btn-blue"
        onclick="setState({ value: 'me' }, { parent: 'child' })"
      >
        Change to me
      </button>
    </div>
  </div>
  <button class="btn btn-blue" onclick="morningClicked(this)">
    Change to morning
  </button>
  <button class="btn btn-blue" onclick="goodbyeClicked(this)">
    Change to goodbye
  </button>
</section>
```

Also multiple labels are supported.

```html
<section x-label="editor" x-state="{ page: 'Hello' }">
  <div x-label="selected" x-state="{ componentId: '123' }">
    <div x="editor.page"></div>
    <div x="editor.page + ' ' + selected.componentId"></div>
    <div x="selected.componentId"></div>
    <button
      class="btn btn-blue"
      onclick="setState({ page: 'Morning' }, { parent: 'editor' })"
    >
      Change only page to morning
    </button>
    <button
      class="btn btn-blue"
      onclick="setState({ componentId: '321' }, { parent: 'selected' })"
    >
      Change only component id to 321
    </button>
  </div>
</section>
```
