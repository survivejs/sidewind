---
slug: "examples"
title: "Examples"
description: "Check these examples to understand what to achieve with Sidewind"
---

# Examples

The examples below combine directives to produce complex user interfaces and to handle specific use cases.

## Calculator

```html
<section
  class="flex flex-col gap-2 md:flex-row justify-between md:max-w-md"
  x-state="{
    amount: 1000,
    interest: 1.2
  }"
>
  <div>
    <label for="amount">Amount</label>
    <input
      id="amount"
      type="text"
      oninput="setState({ amount: this.value })"
      x="state.amount"
    />
  </div>
  <div>
    <label for="interest">Interest</label>
    <input
      id="interest"
      type="text"
      oninput="setState({ interest: this.value })"
      x="state.interest"
    />
  </div>
  <div>
    Total: <span x="Math.round(state.amount * state.interest * 100) / 100" />
  </div>
</section>
```

## Tabs

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
    <div x-if="state === 'animals'">Animals tab</div>
    <div x-if="state === 'languages'">
      Languages tab
    </div>
    <div x-if="state === 'colors'">Colors tab</div>
  </div>
</section>
```

## Code Editor

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

## Table

```html
<table
  x-state="{
    cars: [
      { brand: 'Saab', speed: 'fast' },
      { brand: 'Ferrari', speed: 'faster' },
      { brand: 'Porsche', speed: 'fastest' },
    ]
  }"
  class="table-fixed"
>
  <thead>
    <tr class="bg-gray-400">
      <td class="border p-2">Brand</td>
      <td class="border p-2">Speed</td>
    </tr>
  </thead>
  <tbody x-each="state.cars">
    <tr x-template>
      <td class="border p-2" x="state.value.brand" />
      <td class="border p-2" x="state.value.speed" />
    </tr>
  </tbody>
</table>
```

## Accordion

```html
<section class="flex flex-col gap-2">
  <div x-state="false">
    <div
      class="flex flex-row justify-between cursor-pointer"
      onclick="setState(visible => !visible)"
    >
      <span>Junior Engineer</span>
      <span x="state ? '-' : '+'" />
    </div>
    <div class="py-2 text-gray-600" x-if="state">
      Junior engineer description
    </div>
  </div>
  <div x-state="false">
    <div
      class="flex flex-row justify-between cursor-pointer"
      onclick="setState(visible => !visible)"
    >
      <span>Senior Engineer</span>
      <span x="state ? '-' : '+'" />
    </div>
    <div class="py-2 text-gray-600" x-if="state">
      Senior engineer description
    </div>
  </div>
</section>
```

## Table of Contents

```html
<nav
  x-label="parent"
  x-state="{
    closest: {},
    headings: Array.from(document.querySelectorAll('main h2, h3'))
  }"
  x-closest="{
    state: { closest: document.querySelectorAll('main h2, h3') }
  }"
>
  <ul x-each="state.headings">
    <li x-template>
      <a
        x="state.value.textContent"
        x-attr
        @href="state.value.nextElementSibling?.attributes.href.value"
        @class="[
          state.value.textContent === parent.closest?.textContent && 'font-bold',
          state.value.tagName === 'H3' && 'ml-2'
        ]"
      >
      </a>
    </li>
  </ul>
</nav>
```

## Loading a Partial

```html
<div x-state="{ status: 'pending', partial: '' } ">
  <button
    onmouseover="setState({ status: 'loading' });
    fetch('/assets/partial.html')
      .then(res => res.text())
      .then(partial => setState({
        partial, status: 'loaded'
      }, { element: this }))"
  >
    Show Partial
  </button>
  <div>
    <span x="state.status === 'loading' ? 'Loading...' : ''"></span>
    <span x="state.partial"></span>
  </div>
</div>
```
