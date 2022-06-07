---
slug: "recursion"
title: "Recursion"
description: "Sidewind supports rendering of recursive data structures"
---

# Recursion

To allow operating on a tree-style data that's nested by its nature, a recursion helper is included.

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

To allow rendering more complex structures, `x-recurse` allows you to define which parent to reuse in case multiple `x-each` are used.

```html
<div
  class="flex flex-col gap-2"
  x-state="{
    tree: [
      {
        element: 'BaseLayout',
        props: {
          '##content': [
            {
              element: 'header',
              children: [
                {
                  element: 'h1',
                  children: 'demo'
                }
              ]
            }
          ]
        }
      }
    ]
  }"
>
  <div>
    <ul x-each="state.tree">
      <li x-template x-attr class="flex flex-col gap-2" @class="state.level > 0 && 'ml-2'">
        <div x-if="state.value.element" class="flex flex-row gap-2">
          <h2 class="font-bold">Element</h2>
          <span x="state.value.element"></span>
        </div>
        <div x-if="state.value.props">
          <h2 class="font-bold">Props</h2>
          <ul x-each="Object.entries(state.value.props)">
            <li x-template>
              <span x="state.value[0]"></span>
              <ul x-recurse="{ parentIndex: 1, value: 'state.value[1]' }"></ul>
            </li>
          </ul>
        </div>
        <div x-if="state.value.children">
          <h2 class="font-bold">Children</h2>
          <ul x-each="Array.isArray(state.value.children) ? state.value.children : [state.value.children]">
            <li x-template x-attr @class="state.level > 0 && 'ml-2'">
              <div class="flex flex-row gap-2">
                <h3 class="font-bold">Element</h3>
                <span x="state.value.element"></span>
              </div>
              <ul x-recurse="{ parentIndex: 0, value: 'state.value.children' }"></ul>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </div>
</div>
```
