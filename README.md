**Sidewind** is a light state management solution designed to work together with [Tailwind.css](https://tailwindcss.com) framework. The small addition allows you to add logic to HTML, and when combined with something like [posthtml](https://www.npmjs.com/package/posthtml), to develop your own components without using a framework like Angular, Svelte, React, or Vue.

Sidewind was designed to add interactivity to small sites and it's not a replacement for a full-blown framework. That said, if you don't need much (i.e. routing), it can be enough and it can possibly complement using a framework.

By design, the approach follows the principle of **progressive enhancement** and you pages will be accessible without JavaScript.

## Examples

The basic idea of Sidewind is to leverage HTML data attributes to describe state and to map from state to class names. These two ideas combined with DOM event handlers let you model state related logic as in the examples below.

**Minimal example:**

```html
<section data-state="{ 'toggled': false }">
  <div>Toggled value: <span data-value="toggled" /></div>
  <button
    class="btn btn-blue"
    data-bind="toggled"
    onclick="setState(this, !this.toggled)"
  >
    Toggle value
  </button>
</section>
```

**Tabs:**

```html
<section data-state="'animals'">
  <nav>
    <div
      data-btn-muted="state !== 'animals'"
      onclick="setState(this, 'animals')"
    >
      Animals
    </div>
    <div
      data-btn-muted="state !== 'languages'"
      onclick="setState(this, 'languages')"
    >
      Languages
    </div>
    <div data-btn-muted="state !== 'colors'" onclick="setState(this, 'colors')">
      Colors
    </div>
  </nav>
  <div>
    <div data-hidden="state !== 'animals'">Animals tab</div>
    <div data-hidden="state !== 'languages'">Languages tab</div>
    <div data-hidden="state !== 'colors'">Colors tab</div>
  </div>
</section>
```

**Accordion:**

```html
<article>
  <section data-state="false">
    <div onclick="setState(this, !this.state)">
      Junior Engineer
    </div>
    <div data-hidden="!this.state">Junior engineer description</div>
  </section>
  <section data-state="false">
    <div onclick="setState(this, !this.state)">Senior Engineer</div>
    <div data-hidden="!this.state">Senior engineer description</div>
  </section>
</article>
```

**Calculator:**

```html
<article data-state="{ 'amount': 1000, 'interest': 1.2 }">
  <div>
    <label for="amount">Amount</label>
    <input
      id="amount"
      type="number"
      onchange="e => setState(this, { amount: e.target.value })"
    />
  </div>
  <div>
    <label for="interest">Interest</label>
    <input
      id="interest"
      type="number"
      onchange="e => setState(this, { interest: e.target.value })"
    />
  </div>
  <div>Total: <span data-value="amount * interest" /></div>
</article>
```

**Table:**

```html
<table data-state="fetch('./cars.json')" class="table-fixed">
  <thead>
    <tr>
      <td>Brand</td>
      <td>Color</td>
    </tr>
  </thead>
  <tbody data-each="{ cars: { brand, color } }">
    <tr>
      <td data-value="brand"></td>
      <td data-value="color"></td>
    </tr>
  </tbody>
</table>
```
