---
slug: "sources"
title: "Sources"
description: "Sources allow you to model reactive streams of data"
---
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

## `x-scroll`

`x-scroll` gives you access to the scrolling state of the viewport:

```html
<div
  x-state="{ scrollX: 0, scrollY: 0, scrollWidth: 0, scrollHeight: 0 }"
  x-scroll="{
    state: {
      scrollX: window.scrollX,
      scrollY: window.scrollY,
      scrollWidth: document.body.scrollWidth,
      scrollHeight: document.body.scrollHeight
    }
  }"
>
  Scroll X: <span x="state.scrollX"></span>
  Scroll Y: <span x="state.scrollY"></span>
  Scroll Width: <span x="state.scrollWidth"></span>
  Scroll Height: <span x="state.scrollHeight"></span>
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
    x-attr
    x-intersect="{
      options: { once: true },
      state: { src: '/assets/logo.png' }
    }"
    @src="state.src"
  />
</div>
```

The parent to target can also be the element itself:

```html
<img
  x-state="{ src: '' }"
  x-attr
  x-intersect="{
    options: { once: true },
    state: { src: '/assets/logo.png' }
  }"
  @src="state.src"
/>
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
      cars: fetch('/assets/cars.json').then(res => res.json())
    }
  }"
>
  <ul class="list-disc list-inside" x-each="state.cars">
    <li x-template>
      <span x="state.value.brand"></span> -
      <span x="state.value.color"></span>
    </li>
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
  <ul class="list-disc list-inside" x-each="state.cars">
    <li x-template>
      <span x="state.value.brand"></span> -
      <span x="state.value.color"></span>
    </li>
  </ul>
</div>
```
