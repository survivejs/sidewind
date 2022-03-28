---
slug: "ssr"
---

# Server-side rendering (SSR)

`x-each` supports SSR out of the box (better SEO without JS enabled). In this case, you should take care to populate the state and adjacent elements with the same state (here different content is used for the sake of testing). The elements marked with `x-template` will be removed when `x-each` mounts and it will use the first one as the template.

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
