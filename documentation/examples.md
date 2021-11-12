---
slug: "examples"
title: "Examples"
---

The examples below combine directives to produce complex user interfaces and to handle specific use cases.

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
  <tbody>
    <template x-each="state.cars">
      <tr>
        <td class="border p-2" x="state.value.brand" />
        <td class="border p-2" x="state.value.speed" />
      </tr>
    </template>
  </tbody>
</table>
```

## Accordion

```html
<section>
  <div class="mb-2" x-state="false">
    <div
      class="flex flex-row justify-between cursor-pointer"
      onclick="setState(visible => !visible)"
    >
      <span>Junior Engineer</span>
      <span x="state ? '+' : '-'" />
    </div>
    <div class="py-2 text-gray-600" x-class="!state && 'hidden'">
      Junior engineer description
    </div>
  </div>
  <hr class="my-2" />
  <div x-state="false">
    <div
      class="flex flex-row justify-between cursor-pointer"
      onclick="setState(visible => !visible)"
    >
      <span>Senior Engineer</span>
      <span x="state ? '+' : '-'" />
    </div>
    <div class="py-2 text-gray-600" x-class="!state && 'hidden'">
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
    headings: Array.from(document.querySelectorAll('h2, h3'))
  }"
  x-closest="{
    state: { closest: document.querySelectorAll('h2, h3') }
  }"
>
  <ul>
    <template x-each="state.headings">
      <li>
        <a
          x-href="state.value.nextElementSibling?.attributes.href.value"
          x="state.value.textContent"
          x-class="[
            state.value.textContent === parent.closest?.textContent && 'font-bold',
            state.value.tagName === 'H3' && 'ml-2'
          ]"
        >
        </a>
      </li>
    </template>
  </ul>
</nav>
```

## Loading a Partial

```html
<div x-state="{ status: 'pending', partial: '' } ">
  <button
    onmouseover="setState({ status: 'loading' });
    fetch('./assets/partial.html')
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
