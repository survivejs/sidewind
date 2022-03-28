---
slug: "ssr"
---

# Server-side rendering (SSR)

`x-each` supports SSR out of the box (better SEO without JS enabled) and it is able to hydrate its state from the rendered markup if `x-ssr` is set.

```html
<div class="mb-2">
  <ul class="list-disc list-inside" x-each="state.todos" x-ssr>
    <li x-template>
      <span x="state.value.text">Wash dishes</span>
      <ul x-each="state.value.tags">
        <li x-template x="state.value">chore</li>
      </ul>
      <span x="JSON.stringify(state.value)"></span>
    </li>
    <li x-template>
      <span x="state.value.text">Eat vegetables</span>
      <ul x-each="state.value.tags">
        <li x-template x="state.value">green</li>
        <li x-template x="state.value">food</li>
      </ul>
      <span x="JSON.stringify(state.value)"></span>
    </li>
  </ul>
</div>
```

> TODO: Add manipulations to test that the state is correct
