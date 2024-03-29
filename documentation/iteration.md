---
slug: "iteration"
title: "Iteration"
description: "Sidewind supports rendering list-style data"
---
There are several utilities to allow iteration of arrays and then mapping those to HTML elements.

## `x-each` and `x-template`

`x-each` allows iteration of a list and it has been designed with server-side rendering (SSR) mind so that you can display initial data without JavaScript enabled.

`x-each` connects to an array and then `x-template` is used to mark how to render each item of it while iterating.

```html
<div
  class="flex flex-col gap-2"
  x-state="{
    todos: [
      { text: 'Wash dishes' }, { text: 'Eat carrots' }
    ]
  }"
>
  <div>
    <ul class="list-disc list-inside" x-each="state.todos">
      <li x-template x="state.value.text"></li>
    </ul>
  </div>
  <div x="JSON.stringify(state.todos, null, 2)"></div>
</div>
```

## Data access

Each child of the template has access to the state of the current item.

```html
<div
  class="flex flex-col gap-2"
  x-state="{
    todos: [
      { type: 'Chore', text: 'Wash dishes' },
      { type: 'Food', text: 'Eat carrots' }
    ]
  }"
>
  <div>
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

## Adjacent templates

Same goes for sibling items. Note how multiple templates are grouped together.

```html
<div
  class="flex flex-col gap-2"
  x-state="{
    todos: [
      { type: 'Chore', text: 'Wash dishes' },
      { type: 'Food', text: 'Eat carrots' }
    ]
  }"
>
  <div>
    <ul class="list-disc list-inside" x-each="state.todos">
      <li x-template="group" x="state.value.type"></li>
      <li x-template="group" x="state.value.text"></li>
    </ul>
  </div>
  <div x="JSON.stringify(state.todos, null, 2)"></div>
  <button
    class="btn btn-blue"
    onclick="setState(({ todos }) => ({ todos: todos.concat({ type: 'Food', text: 'Eat karelian pies' }) }))"
  >
    Add item to the end
  </button>
</div>
```

## Focus handling

Iterated items can also have inputs while focus is retained on edit.

```html
<div
  class="flex flex-col gap-2"
  x-state="{
    title: 'Demo',
    description: 'x-each demo'
  }"
  oninput="setState(state => ({
    ...state,
    [event.target.dataset.field]: event.target.value
  }), { element: this })"
>
  <div>
    <ul class="list-disc list-inside" x-each="Object.entries(state)">
      <li x-template>
        <label>
          Field:
          <input
            type="text"
            x-attr
            @data-field="state.value[0]"
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

## Indirect updates

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
  <div>
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
  <div class="flex flex-row gap-2">
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

## Lists inside lists

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
        <ul class="list-disc list-inside ml-2" x-each="state.value.children">
          <li x-template>
            <span x="state.value.text"></span>
          </li>
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

## Complex objects

`x-each` also works with complex objects.

```html
<div
  class="flex flex-col gap-2"
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
  <div>
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
  class="flex flex-col gap-2"
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
  <div>
    <ul class="list-disc list-inside" x-each="state.dataSources">
        <li x-template="group" x="state.value.id"></li>
        <li x-template="group" x="JSON.stringify(state, null, 2)"></li>
        <ul x-template="group" x-each="state.value.transformWith">
          <li x-template x="state.value.name"></li>
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

## Derived state

`x-each` also works with state derived from `x-each`.

```html
<div
  class="flex flex-col gap-2"
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
  <div>
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
