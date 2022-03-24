---
slug: "recursion"
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
