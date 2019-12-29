**Sidewind** is a light state management solution designed to work together with [Tailwind.css](https://tailwindcss.com) framework. The small addition allows you to add logic to HTML, and when combined with something like [posthtml](https://www.npmjs.com/package/posthtml), to develop your own components without using a framework like Angular, Svelte, React, or Vue.

Sidewind was designed to add interactivity to small sites and it's not a replacement for a full-blown framework. That said, if you don't need much (i.e. routing), it can be enough and it can possibly complement using a framework.

By design, the approach follows the principle of **progressive enhancement** and you pages will be accessible without JavaScript.

## Examples

### Minimal example

```html
<section data-state="false">
  <div>Toggled value: <span data-value="state" /></div>
  <button class="btn btn-blue" onclick="setState(this, !this.state)">
    Toggle value
  </button>
</section>
```

### Tabs

```html
<section data-state="'animals'">
  <nav class="flex flex-row justify-between">
    <div
      class="p-2 w-full"
      data-btn-muted="state !== 'animals'"
      data-bg-gray-200="state === 'animals'"
      onclick="setState(this, 'animals')"
    >
      Animals
    </div>
    <div
      class="p-2 w-full"
      data-btn-muted="state !== 'languages'"
      data-bg-gray-200="state === 'languages'"
      onclick="setState(this, 'languages')"
    >
      Languages
    </div>
    <div
      class="p-2 w-full"
      data-btn-muted="state !== 'colors'"
      data-bg-gray-200="state === 'colors'"
      onclick="setState(this, 'colors')"
    >
      Colors
    </div>
  </nav>
  <div class="bg-gray-100 p-2">
    <div data-hidden="state !== 'animals'">Animals tab</div>
    <div data-hidden="state !== 'languages'">Languages tab</div>
    <div data-hidden="state !== 'colors'">Colors tab</div>
  </div>
</section>
```

### Accordion

```html
<article>
  <section class="mb-2" data-state="false">
    <div
      class="flex flex-row justify-between"
      onclick="setState(this, !this.state)"
    >
      <span>Junior Engineer</span>
      <span class="arrow">
        <span class="arrow-down" data-hidden="state">▼</span>
        <span class="arrow-up" data-hidden="!state">▲</span>
      </span>
    </div>
    <div class="py-2 bg-gray-200" data-hidden="!state">
      Junior engineer description
    </div>
  </section>
  <section data-state="false">
    <div
      class="flex flex-row justify-between"
      onclick="setState(this, !this.state)"
    >
      <span>Senior Engineer</span>
      <span class="arrow">
        <span class="arrow-down" data-hidden="state">▼</span>
        <span class="arrow-up" data-hidden="!state">▲</span>
      </span>
    </div>
    <div class="py-2 bg-gray-200" data-hidden="!state">
      Senior engineer description
    </div>
  </section>
</article>
```

### Calculator

```html
<article data-state="{ 'amount': 1000, 'interest': 1.2 }">
  <div>
    <label for="amount">Amount</label>
    <input
      id="amount"
      type="text"
      oninput="setState(this, { amount: this.value })"
      data-value="amount"
    />
  </div>
  <div>
    <label for="interest">Interest</label>
    <input
      id="interest"
      type="text"
      oninput="setState(this, { interest: this.value })"
      data-value="interest"
    />
  </div>
  <div>Total: <span data-value="amount * interest" /></div>
</article>
```

### Table

```html
<table data-fetch="./demo/cars.json" class="table-fixed">
  <thead>
    <tr>
      <td>Brand</td>
      <td>Color</td>
    </tr>
  </thead>
  <tbody data-each="{ brand, color }">
    <tr>
      <td data-value="brand"></td>
      <td data-value="color"></td>
    </tr>
  </tbody>
</table>
```
