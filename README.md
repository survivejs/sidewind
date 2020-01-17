# Sidewind - Tailwind but for state

**Sidewind** is a light (~6k minified) state management solution designed to work together with [Tailwind.css](https://tailwindcss.com) framework. The small addition allows you to add logic to HTML, and when combined with something like [posthtml](https://www.npmjs.com/package/posthtml), to develop your own components without using a framework like Angular, Svelte, React, or Vue.

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
<article x-state="{ amount: 1000, interest: 1.2 }">
  Total:
  <span x-bind="state.amount * state.interest" />
</article>
```

> [The calculator example](#calculator) takes this idea further and shows how to handle user interaction.

`x-state` accepts complex JavaScript expressions as well and exposes `document.querySelectorAll` through `$` alias.

```html
<ul x-state="{ headings: $('h2') }">
  <template x-each="headings">
    <li>
      <a
        x-attr
        x:href="state.nextElementSibling.attributes.href.value"
        x-bind="textContent"
      >
      </a>
    </li>
  </template>
</ul>
```

It's possible to use the standard [fetch() API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) on top of `x-state` for fetching data as it handles Promises for you internally:

```html
<div x-state="{ cars: fetch('./assets/cars.json').then(res => res.json()) }">
  <ul class="list-disc list-inside">
    <template x-each="cars">
      <li><span x-bind="brand" /> - <span x-bind="color" /></li>
    </template>
  </ul>
</div>
```

### `x-attr`

In addition to binding values, it's possible to bind attributes:

```html
<section x-state="{ target: 'https://survivejs.com' }">
  <a x-attr x:href="target">Link target</a>
</section>
```

For classes, it's possible to pass an array to evaluate to produce multiple classes based on expressions:

```html
<section x-state="{ target: 'https://survivejs.com' }">
  <a
    x-attr
    x:href="target"
    x:class="[
      'p-2',
      state.target === 'https://survivejs.com' && 'bg-gray-400'
    ]"
    >Link target</a
  >
</section>
```

### `x-each`

`x-each` allows iteration of a list. It has been designed to be used with a [template tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template).

```html
<div x-state="{ todos: [{ text: 'Wash dishes' }, { text: 'Eat carrots' }] }">
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

### `x-label`

`x-label` gives access to parent state and it's useful for sharing information between scopes in one direction.

```html
<div x-label="i18n" x-state="{ hello: 'Terve' }">
  <div x-state="{ world: 'World' }">
    <span x-bind="i18n.hello + ' ' + state.world" />
  </div>
</div>
```

## Sources

Sources wrap browser state within a reactive stream that's then mapped to a state.

### `x-closest`

`x-closest` gives you access to the element closest to display top within the selected elements:

```html
<div x-closest="{ state: { closest: $('h2, h3') } }">
  Closest heading: <span x-bind="closest.textContent" />
</div>
```

### `x-intersect`

`x-intersect` triggers when the element is visible at the viewport. See [IntersectionObserver documentation](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/IntersectionObserver) for available options.

```html
<div x-intersect="{ state: { intersected: new Date().toString() } }">
  Intersected at <span x-bind="intersected" />
</div>
```

In addition to the standard options, there's an `once` flag that when set causes the state to be set only once. The behavior is useful for implementing patterns such as lazy loading.

```html
<img
  x-intersect="{ options: { once: true }, state: { src: './assets/logo.png' } }"
  x-attr
  x:src="src"
/>
```

### `x-interval`

`x-interval` wraps [setInterval](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval) and exposes its `delay` parameters. When triggered, it sets state.

```html
<div
  x-interval="{ options: { delay: 1000 }, state: { time: new Date().toString() } }"
  x-bind="time"
/>
```

## Examples

The examples below combine directives to produce complex user interfaces and to handle specific use cases.

### Calculator

```html
<article
  class="flex flex-col md:flex-row justify-between md:max-w-md"
  x-state="{ amount: 1000, interest: 1.2 }"
>
  <div class="mb-2">
    <label for="amount">Amount</label>
    <input
      id="amount"
      type="text"
      oninput="setState({ amount: this.value })"
      x-bind="amount"
    />
  </div>
  <div class="mb-2">
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
  x-state="{ text: '', todos: [] }"
  onsubmit="setState({ text: '', todos: this.state.todos.concat({ text: this.state.text }) })"
  action="javascript:"
>
  <div class="mb-2">
    <label class="mr-2">
      <span>Add Todo</span>
      <input
        id="text"
        type="text"
        oninput="setState({ text: this.value })"
        x-bind="text"
      />
    </label>
    <button class="btn btn-blue" type="submit">Add</button>
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
    <tr class="bg-gray-400">
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

### Accordion

```html
<article>
  <section class="mb-2" x-state="false">
    <div
      class="flex flex-row justify-between cursor-pointer"
      onclick="setState(!this.state)"
    >
      <span>Junior Engineer</span>
      <div>
        <span x-attr x:class="state && 'hidden'">▼</span>
        <span x-attr x:class="!state && 'hidden'">▲</span>
      </div>
    </div>
    <div class="py-2 bg-gray-200" x-attr x:class="!state && 'hidden'">
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
        <span x-attr x:class="state && 'hidden'">▼</span>
        <span x-attr x:class="!state && 'hidden'">▲</span>
      </div>
    </div>
    <div class="py-2 bg-gray-200" x-attr x:class="!state && 'hidden'">
      Senior engineer description
    </div>
  </section>
</article>
```

### Tabs

```html
<section x-state="'animals'">
  <nav class="flex flex-row justify-between cursor-pointer">
    <div
      x-attr
      x:class="[
        'p-2',
        'w-full',
        state === 'animals' ? 'bg-gray-400' : 'btn-muted'
      ]"
      class="p-2 w-full"
      onclick="setState('animals')"
    >
      Animals
    </div>
    <div
      x-attr
      x:class="[
        'p-2',
        'w-full',
        state === 'languages' ? 'bg-gray-400' : 'btn-muted'
      ]"
      onclick="setState('languages')"
    >
      Languages
    </div>
    <div
      x-attr
      x:class="[
        'p-2',
        'w-full',
        state === 'colors' ? 'bg-gray-400' : 'btn-muted'
      ]"
      onclick="setState('colors')"
    >
      Colors
    </div>
  </nav>
  <div class="bg-gray-100 p-2">
    <div
      x-attr
      x:class="[
        state !== 'animals' && 'hidden'
      ]"
    >
      Animals tab
    </div>
    <div
      x-attr
      x:class="[
        state !== 'languages' && 'hidden'
      ]"
    >
      Languages tab
    </div>
    <div
      x-attr
      x:class="[
        state !== 'colors' && 'hidden'
      ]"
    >
      Colors tab
    </div>
  </div>
</section>
```

### Table of Contents

```html
<nav
  x-label="parent"
  x-state="{ headings: $('h2, h3') }"
  x-closest="{ state: { closest: $('h2, h3') } }"
>
  <ul>
    <template x-each="headings">
      <li>
        <a
          x-attr
          x:href="state.nextElementSibling.attributes.href.value"
          x-bind="textContent"
          x:class="[
            state.textContent === parent.closest.textContent && 'font-bold',
            state.tagName === 'H3' && 'ml-2'
          ]"
        >
        </a>
      </li>
    </template>
  </ul>
</nav>
```

## Related Approaches

- [Alpine.js](https://github.com/alpinejs/alpine) provides a similar yet more broad API closer to Angular than Sidewind.

## License

MIT.
