---
slug: "ssr"
title: "SSR"
description: "Sidewind is able to hydrate its state from HTML markup"
---

# Server-side rendering (SSR)

`x-each` supports SSR out of the box (better SEO without JS enabled). When `x-ssr` is set, Sidewind will read its state from the markup thereby resuming execution. In other words, Sidewind implements a simple form of resumability.

Note that this doesn't work with complex expressions for now and only direct value lookup is supported as it's possible to figure out object keys and values based on that. Also template groups aren't supported yet.

```html
<div x-state="{ todos: [] }" class="flex flex-col gap-2">
  <div class="flex gap-2">
    <button
      class="btn btn-blue"
      onclick="setState(({ todos }) => ({ todos: [{ text: 'New item at the beginning' }].concat(todos) }))"
    >
      Add item to the beginning
    </button>
    <button
      class="btn btn-blue"
      onclick="setState(({ todos }) => ({ todos: todos.concat({ text: 'New item at the end' }) }))"
    >
      Add item to the end
    </button>
    <button
      class="btn btn-blue"
      onclick="setState(({ todos }) => ({ todos: todos.slice().sort((a, b) => a.text.localeCompare(b.text)) }))"
    >
      Sort (asc.)
    </button>
    <button
      class="btn btn-blue"
      onclick="setState(({ todos }) => ({ todos: todos.slice().sort((a, b) => b.text.localeCompare(a.text)) }))"
    >
      Sort (desc.)
    </button>
  </div>
  <div>
    <ul class="list-disc list-inside" x-each="state.todos" x-ssr>
      <li x-template>
        <span x="state.value.text">Wash dishes</span>
        <ul class="list-decimal list-inside ml-2" x-each="state.value.tags">
          <li x-template x="state.value">chore</li>
        </ul>
      </li>
      <li x-template>
        <span x="state.value.text">Eat vegetables</span>
        <ul class="list-decimal list-inside ml-2" x-each="state.value.tags">
          <li x-template x="state.value">green</li>
          <li x-template x="state.value">food</li>
        </ul>
      </li>
    </ul>
  </div>
  <div x="JSON.stringify(state.todos, null, 2)"></div>
</div>
```

## Hydrating nested objects

`x-ssr` is able to reconstruct nested objects as well:

```html
<div x-state="{ todos: [] }" class="flex flex-col gap-2">
  <div>
    <ul class="list-disc list-inside" x-each="state.todos" x-ssr>
      <li x-template>
        <span x="state.value.text">Wash dishes</span>
        <ul class="list-decimal list-inside ml-2" x-each="state.value.entity.tags">
          <li x-template x="state.value">chore</li>
        </ul>
      </li>
      <li x-template>
        <span x="state.value.text">Eat vegetables</span>
        <ul class="list-decimal list-inside ml-2" x-each="state.value.entity.tags">
          <li x-template x="state.value">green</li>
          <li x-template x="state.value">food</li>
        </ul>
      </li>
    </ul>
  </div>
  <div x="JSON.stringify(state.todos, null, 2)"></div>
</div>
```
