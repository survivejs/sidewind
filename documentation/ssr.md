---
slug: "ssr"
---

# Server-side rendering (SSR)

`x-each` supports SSR out of the box (better SEO without JS enabled) and it is able to hydrate its state from the rendered markup if `x-ssr` is set at the boundary.

Note that this doesn't work with complex expressions for now and only direct value lookup is supported as it's possible to figure out object keys and values based on that. Also template groups aren't supported yet.

```html
<div x-state="{ todos: [] }">
  <div class="mb-2">
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
