# Sidewind - Tailwind but for state

**Sidewind** is a light (~4k minified) state management solution designed to work together with [Tailwind.css](https://tailwindcss.com) framework. The small addition allows you to add logic to HTML, and when combined with something like [posthtml](https://www.npmjs.com/package/posthtml), to develop your own components without using a framework like Angular, Svelte, React, or Vue.

Sidewind was designed to add interactivity to small sites and it's not a replacement for a full-blown framework. That said, if you don't need much (i.e. routing), it can be enough and it can possibly complement using a framework.

By design, the approach follows the principle of **progressive enhancement** and your pages will be accessible without JavaScript.

## Directives

Sidewind is composed of a collection of directives that operate on the DOM. I've documented them in detail below.

### `x-state` and `x-bind`

`x-state` is a state container and the state is often used by other directives such as `x-bind`. Consider the example below:

```html
<section x-state="false">Value: <span x-bind="state" /></section>
```

`x-state` and `x-bind` can exist even within the same element:

```html
<section>Value: <span x-state="false" x-bind="state" /></section>
```

The state can be manipulated using a global `setState`:

```html
<section x-state="false">
  <div class="mb-2">Value: <span x-bind="state" /></div>
  <button class="btn btn-blue" onclick="setState(!this.state)">
    Toggle value
  </button>
</section>
```

State can be a complex object:

```html
<article x-state="{ 'amount': 1000, 'interest': 1.2 }">
  Total:
  <span x-bind="state.amount * state.interest" />
</article>
```

> [The calculator example](#calculator) takes this idea further and shows how to handle user interaction.

`x-state` accepts complex JavaScript expressions as well and exposes `document.querySelectorAll` through `$` alias.

```html
<nav x-state="{ headings: $('h2, h3') }">
  <ul class="list-disc list-inside">
    <template x-each="headings">
      <li>
        <span x-bind="nodeName"></span> - <span x-bind="textContent"></span> -
        <span x-bind="nextElementSibling.attributes.href.value"></span>
        -
        <a
          x-attr
          x:href="nextElementSibling.attributes.href.value"
          x-bind="textContent"
        ></a>
      </li>
    </template>
  </ul>
</nav>
```

It's possible to use the standard [fetch() API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) on top of `x-state` for fetching data as it handles Promises for you internally:

```html
<div
  x-state="{ cars: fetch('./assets/cars.json').then(res => res.json()) }"
  class="table-fixed"
>
  <ul class="list-disc list-inside">
    <template x-each="cars">
      <li><span x-bind="brand"></span> - <span x-bind="color"></span></li>
    </template>
  </ul>
</div>
```

### `x-on`, and `x-off`

Given Tailwind is an utility class based CSS approach for styling, Sidewind provides means for connecting state with classes. `x-on` and `x-off` allow you to set classes if state is either true (`x-on`) or false (`x-off`) as the accordion example below illustrates:

```html
<article>
  <section class="mb-2" x-state="false">
    <div
      class="flex flex-row justify-between cursor-pointer"
      onclick="setState(!this.state)"
    >
      <span>Junior Engineer</span>
      <div>
        <span x-on="hidden">▼</span>
        <span x-off="hidden">▲</span>
      </div>
    </div>
    <div class="py-2 bg-gray-200" x-off="hidden">
      Junior engineer description
    </div>
  </section>
  <hr class="my-2" />
  <section x-state="false">
    <div
      class="flex flex-row justify-between cursor-pointer"
      onclick="setState(!this.state)"
    >
      <span>Senior Engineer</span>
      <div>
        <span x-on="hidden">▼</span>
        <span x-off="hidden">▲</span>
      </div>
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

### `x-each`

`x-each` allows iteration of a list. It has been designed to be used with a [template tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template).

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
  <div x-bind="todos"></div>
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
      x-bind="amount"
    />
  </div>
  <div>
    <label for="interest">Interest</label>
    <input
      id="interest"
      type="text"
      oninput="setState({ interest: this.value })"
      x-bind="interest"
    />
  </div>
  <div>
    Total:
    <span x-bind="Math.round(state.amount * state.interest * 100) / 100" />
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
        x-bind="text"
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
  <div x-bind="todos"></div>
</form>
```

### Table

```html
<table
  x-state="{ cars: fetch('./assets/cars.json').then(res => res.json()) }"
  class="table-fixed"
>
  <thead>
    <tr class="bg-gray-200">
      <td class="border p-2">Brand</td>
      <td class="border p-2">Color</td>
    </tr>
  </thead>
  <tbody>
    <template x-each="cars">
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
