---
slug: "examples"
---

# Examples

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
<section>
  <div class="mb-2" x-state="false">
    <div
      class="flex flex-row justify-between cursor-pointer"
      onclick="setState(visible => !visible)"
    >
      <span>Junior Engineer</span>
      <span x="state ? '-' : '+'" />
    </div>
    <div x-attr class="py-2 text-gray-600" @class="!state && 'hidden'">
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
      <span x="state ? '-' : '+'" />
    </div>
    <div x-attr class="py-2 text-gray-600" @class="!state && 'hidden'">
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
    headings: Array.from(document.querySelectorAll('#main h2, h3'))
  }"
  x-closest="{
    state: { closest: document.querySelectorAll('#main h2, h3') }
  }"
>
  <ul>
    <template x-each="state.headings">
      <li>
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
    </template>
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
