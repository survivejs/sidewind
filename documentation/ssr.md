---
slug: "ssr"
---

# Server-side rendering (SSR)

`x-each` supports SSR out of the box (better SEO without JS enabled) and it is able to hydrate its state from the rendered markup.

```html
<div x-state="{ todos: [] }">
  <div class="mb-2">
    <ul class="list-disc list-inside" x-each="state.todos">
      <li x-template>
        <div>
          <span x="state.value.text">Wash dishes</span>
        </div>
        <ul x-each="state.value.tags">
          <li x-template x="state.value">chore</li>
        </ul>
      </li>
      <li x-template>
        <div>
          <span x="state.value.text">Eat vegetables</span>
        </div>
        <ul x-each="state.value.tags">
          <li x-template x="state.value">green</li>
          <li x-template x="state.value">food</li>
        </ul>
      </li>
    </ul>
  </div>
  <div x="JSON.stringify(state.todos, null, 2)"></div>
</div>
```
