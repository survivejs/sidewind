---
slug: "sources"
---

# Sources

Sources wrap browser state within a reactive stream that's then mapped to a state internally.

## `x-closest`

`x-closest` gives you access to the element closest to display top within the selected elements:

```html
<div
  x-state="{ closest: '' }"
  x-closest="{
    state: { closest: document.querySelectorAll('h2, h3') }
  }"
>
  Closest heading: <span x="state.closest.textContent"></span>
</div>
```

## `x-intersect`

`x-intersect` triggers when the element is visible at the viewport. See [IntersectionObserver documentation](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/IntersectionObserver) for available options.

```html
<div
  x-state="{ intersected: '' }"
  x-intersect="{
    state: { intersected: new Date().toString() }
  }"
>
  Intersected at <span x="state.intersected"></span>
</div>
```

In addition to the standard options, there's an `once` flag that when set causes the state to be set only once. The behavior is useful for implementing patterns such as lazy loading.

```html
<div x-state="{ src: '' }">
  <img
    x-intersect="{
      options: { once: true },
      state: { src: '/logo.png' }
    }"
    x-src="state.src"
  />
</div>
```

## `x-interval`

`x-interval` wraps [setInterval](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval) and exposes its `delay` parameters. When triggered, it sets state.

```html
<div
  x-state="{ time: '' }"
  x-interval="{
    options: { delay: 1000 },
    state: { time: new Date().toString() }
  }"
>
  <span class="font-bold">Current time:</span> <span x="state.time" />
</div>
```

## `x-promise`

It's possible to use the standard [fetch() API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) on top of `x-promise` to handle data requests:

```html
<div
  x-state="{ cars: [] }"
  x-promise="{
    state: {
      cars: fetch('/cars.json').then(res => res.json())
    }
  }"
>
  <ul class="list-disc list-inside">
    <template x-each="state.cars">
      <li>
        <span x="state.value.brand"></span> -
        <span x="state.value.color"></span>
      </li>
    </template>
  </ul>
</div>
```

In case there's an error, then the `Error` object is emitted to `error` state:

```html
<div
  x-state="{ cars: [], error: {} }"
  x-promise="{
    state: {
      cars: fetch('/404.json').then(res => res.json())
    }
  }"
>
  <div x="state.error.message" />
  <ul class="list-disc list-inside">
    <template x-each="state.cars">
      <li>
        <span x="state.value.brand"></span> -
        <span x="state.value.color"></span>
      </li>
    </template>
  </ul>
</div>
```
