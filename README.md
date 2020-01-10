# Sidewind - Tailwind but for state

**Sidewind** is a light (~4k minified) state management solution designed to work together with [Tailwind.css](https://tailwindcss.com) framework. The small addition allows you to add logic to HTML, and when combined with something like [posthtml](https://www.npmjs.com/package/posthtml), to develop your own components without using a framework like Angular, Svelte, React, or Vue.

Sidewind was designed to add interactivity to small sites and it's not a replacement for a full-blown framework. That said, if you don't need much (i.e. routing), it can be enough and it can possibly complement using a framework.

By design, the approach follows the principle of **progressive enhancement** and your pages will be accessible without JavaScript.

## Directives

Sidewind is composed of a collection of directives that operate on the DOM. I've documented them in detail below.

### `x-state` and `x-value`

`x-state` is a state container and the state is often used by other directives such as `x-value`. Consider the example below:

```html
<section x-state="false">Value: <span x-value="state" /></section>
```

The state can be manipulated using a global `setState`:

```html
<section x-state="false">
  <div class="mb-2">Value: <span x-value="state" /></div>
  <button class="btn btn-blue" onclick="setState(!this.state)">
    Toggle value
  </button>
</section>
```

State can be a complex object:

```html
<article x-state="{ 'amount': 1000, 'interest': 1.2 }">
  Total:
  <span x-value="state.amount * state.interest" />
</article>
```

> [The calculator example](#calculator) takes this idea further and shows how to handle user interaction.

### `x-on`, and `x-off`

Given Tailwind is an utility class based CSS approach for styling, Sidewind provides means for connecting state with classes. `x-on` and `x-off` allow you to set classes if state is either true (`x-on`) or false (`x-off`) as the accordion example below illustrates:

```html
<article>
  <section class="mb-2" x-state="false">
    <div class="flex flex-row justify-between" onclick="setState(!this.state)">
      <span>Junior Engineer</span>
      <span class="arrow">
        <span class="arrow-down" x-on="hidden">▼</span>
        <span class="arrow-up" x-off="hidden">▲</span>
      </span>
    </div>
    <div class="py-2 bg-gray-200" x-off="hidden">
      Junior engineer description
    </div>
  </section>
  <section x-state="false">
    <div class="flex flex-row justify-between" onclick="setState(!this.state)">
      <span>Senior Engineer</span>
      <span class="arrow">
        <span class="arrow-down" x-on="hidden">▼</span>
        <span class="arrow-up" x-off="hidden">▲</span>
      </span>
    </div>
    <div class="py-2 bg-gray-200" x-off="hidden">
      Senior engineer description
    </div>
  </section>
</article>
```

### `x-case`

`x-case` has been designed to allow combining `x-on` and `x-off` with `switch/case` kind of matching:

```html
<section x-state="'animals'">
  <nav class="flex flex-row justify-between">
    <div
      class="p-2 w-full"
      x-case="animals"
      x-on="bg-gray-200"
      x-off="btn-muted"
      onclick="setState('animals')"
    >
      Animals
    </div>
    <div
      class="p-2 w-full"
      x-case="languages"
      x-on="bg-gray-200"
      x-off="btn-muted"
      onclick="setState('languages')"
    >
      Languages
    </div>
    <div
      class="p-2 w-full"
      x-case="colors"
      x-on="bg-gray-200"
      x-off="btn-muted"
      onclick="setState('colors')"
    >
      Colors
    </div>
  </nav>
  <div class="bg-gray-100 p-2">
    <div x-case="animals" x-off="hidden">Animals tab</div>
    <div x-case="languages" x-off="hidden">Languages tab</div>
    <div x-case="colors" x-off="hidden">Colors tab</div>
  </div>
</section>
```

### `x-each` and `x-bind`

`x-each` allows iteration of a list. It has been designed to be used with a [template tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template). To access values during iteration, use `x-bind` as below:

```html
<div
  x-state="{ 'todos': [{ 'text': 'Wash dishes' }, { 'text': 'Eat carrots' }] }"
>
  <div class="mb-2">
    <ul class="list-disc list-inside">
      <template x-each="todos">
        <li x-bind="text"></li>
      </template>
    </ul>
  </div>
  <div x-value="todos"></div>
</div>
```

### `x-fetch`

`x-fetch` wraps [fetch() API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) to allow fetching data:

```html
<div x-fetch="./assets/cars.json" class="table-fixed">
  <ul class="list-disc list-inside">
    <template x-each="brand, color">
      <li><span x-bind="brand"></span> - <span x-bind="color"></span></li>
    </template>
  </ul>
</div>
```

## Examples

The examples below combine directives to produce complex user interfaces and to handle specific use cases.

### Calculator

```html
<article
  class="flex flex-row justify-between md:max-w-md"
  x-state="{ 'amount': 1000, 'interest': 1.2 }"
>
  <div>
    <label for="amount">Amount</label>
    <input
      id="amount"
      type="text"
      oninput="setState({ amount: this.value })"
      x-value="amount"
    />
  </div>
  <div>
    <label for="interest">Interest</label>
    <input
      id="interest"
      type="text"
      oninput="setState({ interest: this.value })"
      x-value="interest"
    />
  </div>
  <div>
    Total:
    <span x-value="Math.round(state.amount * state.interest * 100) / 100" />
  </div>
</article>
```

### TODO List

```html
<form
  x-state="{ 'text': '', 'todos': [] }"
  onsubmit="setState({ text: '', todos: this.state.todos.concat({ text: this.state.text }) })"
  action="javascript:"
>
  <div class="mb-2">
    <label>
      <span>Add Todo</span>
      <input
        id="text"
        type="text"
        oninput="setState({ text: this.value })"
        x-value="text"
      />
    </label>
    <button type="submit">Add</button>
  </div>
  <div class="mb-2">
    <ul class="list-disc list-inside">
      <template x-each="todos">
        <li x-bind="text"></li>
      </template>
    </ul>
  </div>
  <div x-value="todos"></div>
</form>
```

### Table

```html
<table x-fetch="./assets/cars.json" class="table-fixed">
  <thead>
    <tr class="bg-gray-200">
      <td class="border p-2">Brand</td>
      <td class="border p-2">Color</td>
    </tr>
  </thead>
  <tbody>
    <template x-each="brand, color">
      <tr>
        <td class="border p-2" x-bind="brand"></td>
        <td class="border p-2" x-bind="color"></td>
      </tr>
    </template>
  </tbody>
</table>
```

## Related Approaches

- [Alpine.js](https://github.com/alpinejs/alpine) provides a similar yet more broad API closer to Angular than Sidewind.

## License

MIT.
