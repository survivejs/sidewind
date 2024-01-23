---
slug: "attributes"
title: "Attributes"
description: "Sidewind allows binding data to HTML attributes"
---
To allow binding state to HTML element attributes, a couple of helpers are provided.

## `x-attr`

It's possible to bind attributes with `x-attr`:

```html
<section x-state="{ target: 'https://survivejs.com' }">
  <a x-attr @href="state.target">Link target</a>
</section>
```

The idea is that `x-attr` tells Sidewind that there are bindings and then `@` is used to signify which. Using the keyword is a small optimization and it also makes it easier to find spots in code where you might have attribute bindings in place.

## Expressions

For classes, it's possible to pass an array to evaluate to produce multiple classes based on expressions:

```html
<section x-state="{ target: 'https://survivejs.com' }">
  <a
    x-attr
    @href="state.target"
    @class="[
      state.target === 'https://google.com' && 'bg-red-400',
      state.target === 'https://survivejs.com' && 'bg-gray-400'
    ]"
    >Link target</a
  >
</section>
```

## Attribute fallbacks

Default classes are retained as this allows more compact syntax with a fallback:

```html
<section x-state="{ target: 'https://survivejs.com' }">
  <a
    x-attr
    class="p-2"
    @class="state.target === 'https://survivejs.com' && 'bg-gray-400'"
    @href="state.target"
    >Link target</a
  >
  <button
    class="btn btn-blue"
    onclick="setState({ target: 'https://google.com' })"
  >
    Change target
  </button>
</section>
```

