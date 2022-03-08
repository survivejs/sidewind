**Sidewind** is a light (~7k minified) state management solution designed to work together with utility CSS based frameworks, such as [Tailwind.css](https://tailwindcss.com).

Sidewind was designed small sites and applications in mind. It allows you to sprinkle state where you need it right in the HTML structure.

For anything more serious, it's a good idea to combine it with a solution that comes with a component abstraction. For example, [Gustwind site generator](https://gustwind.js.org/) was designed for this purpose.

In addition to being light, the approach follows the principle of **progressive enhancement** making your pages accessible even if JavaScript isn't available.

## Examples

To get an idea of what it's like to develop with Sidewind, try tweaking the following examples.

### Calculator

```html
<article
  class="flex flex-col md:flex-row justify-between md:max-w-md"
  x-state="{
    amount: 1000,
    interest: 1.2
  }"
>
  <div class="mb-2">
    <label for="amount">Amount</label>
    <input
      id="amount"
      type="text"
      oninput="setState({ amount: this.value })"
      x="state.amount"
    />
  </div>
  <div class="mb-2">
    <label for="interest">Interest</label>
    <input
      id="interest"
      type="text"
      oninput="setState({ interest: this.value
    })"
      x="state.interest"
    />
  </div>
  <div>
    Total: <span x="Math.round(state.amount * state.interest * 100) / 100" />
  </div>
</article>
```

### TODO List

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
>
  <div class="mb-2">
    <label class="mr-2">
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
  <div class="mb-2">
    <ul class="list-disc list-inside" x-each="state.todos">
      <li x-template x="state.value.text" />
    </ul>
  </div>
  <div x="JSON.stringify(state.todos, null, 2)"></div>
</form>
```

### Tabs

```html
<section x-state="'animals'">
  <nav class="flex flex-row justify-between cursor-pointer">
    <div
      x-attr
      class="p-2 w-full"
      @class="state === 'animals' ? 'bg-gray-400' : 'btn-muted'"
      onclick="setState('animals')"
    >
      Animals
    </div>
    <div
      x-attr
      class="p-2 w-full"
      @class="state === 'languages' ? 'bg-gray-400' : 'btn-muted'"
      onclick="setState('languages')"
    >
      Languages
    </div>
    <div
      x-attr
      class="p-2 w-full"
      @class="state === 'colors' ? 'bg-gray-400' : 'btn-muted'"
      onclick="setState('colors')"
    >
      Colors
    </div>
  </nav>
  <div class="bg-gray-100 p-2">
    <div x-attr @class="state === 'animals' ? '' : 'hidden'">Animals tab</div>
    <div x-attr @class="state === 'languages' ? '' : 'hidden'">
      Languages tab
    </div>
    <div x-attr @class="state === 'colors' ? '' : 'hidden'">Colors tab</div>
  </div>
</section>
```

### Code Editor

```html
<div class="flex font-mono relative" x-state="'console.log(\'demo\')'">
  <pre x="highlight('js', state)"></pre>
  <textarea
    class="absolute min-w-full min-h-full top-0 left-0 outline-none opacity-50 bg-transparent whitespace-pre resize-none"
    oninput="setState(this.value)"
    x="state"
    autocapitalize="off"
    autocomplete="off"
    autocorrect="off"
    spellcheck="false"
  ></textarea>
</div>
```

## Related Approaches

- [Alpine.js](https://github.com/alpinejs/alpine) provides a similar yet more broad API closer to Angular than Sidewind.
- [amp-bind](https://amp.dev/documentation/components/amp-bind/) implements data binding and expressions.
- [htmx](https://htmx.org/) is a complete solution with server integration.
- [Mavo](https://mavo.io) implements a DSL on top of HTML for light interactivity.
- [qwik](https://github.com/BuilderIO/qwik) is an entire HTML-first framework built with resumability and lazy loading in mind.
- [Svelte](https://svelte.dev) implements a compiler based approach.
- [Vue](https://vuejs.org), and especially Vue 3, allows similar usage in the frontend as Sidewind. See also [petite-vue](https://github.com/vuejs/petite-vue).

## License

MIT.
