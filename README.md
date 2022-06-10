**Sidewind** is a light (~16k minified) state management solution designed to work together with utility CSS based frameworks, such as [Tailwind.css](https://tailwindcss.com).

## Why Sidewind?

Sidewind was designed small sites and applications in mind. It allows you to sprinkle state where you need it right in the HTML structure.

The library follows the principle of **progressive enhancement** making your pages accessible even if JavaScript isn't available. It supports [state hydration from rendered markup](/ssr/) making it a good fit for cases where you want to add interactivity to otherwise static content (i.e. lists, tables, grids).

> For anything more serious, it's a good idea to combine it with a solution that comes with a component abstraction. For example, [Gustwind site generator](https://gustwind.js.org/) was designed for this purpose and the site you see was generated using it.

## Dive in

To get an idea of what it's like to develop with Sidewind, try tweaking the following example and studying the documentation.

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
  class="flex flex-col gap-2"
>
  <div class="flex flex-row gap-2">
    <label>
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
  <div>
    <ul class="list-disc list-inside" x-each="state.todos">
      <li x-template x="state.value.text" />
    </ul>
  </div>
  <div x="JSON.stringify(state.todos, null, 2)"></div>
</form>
```

## Related approaches

Sidewind isn't the only alternative out there and I've listed several of the ones I'm aware of below:

- [Alpine.js](https://github.com/alpinejs/alpine) provides a similar yet more broad API closer to Angular than Sidewind.
- [amp-bind](https://amp.dev/documentation/components/amp-bind/) implements data binding and expressions.
- [htmx](https://htmx.org/) is a complete solution with server integration.
- [Mavo](https://mavo.io) implements a DSL on top of HTML for light interactivity.
- [qwik](https://github.com/BuilderIO/qwik) is an entire HTML-first framework built with resumability and lazy loading in mind.
- [Svelte](https://svelte.dev) implements a compiler based approach.
- [Vue](https://vuejs.org), and especially Vue 3, allows similar usage in the frontend as Sidewind. See also [petite-vue](https://github.com/vuejs/petite-vue).

## License

MIT.
