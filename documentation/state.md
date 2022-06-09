---
slug: "state"
title: "State"
description: "State is the most basic building block of Sidewind"
---

# State

State management is the most basic feature of Sidewind and most features rely on it. At the simplest level, you can use it to define simple UIs that derive values from the user input.

## `x-state` and `x`

`x-state` is a state container and the state is often used by other directives. `x` is used for binding values. Consider the example below:

```html
<section x-state="false">Value: <span x="state"></span></section>
```

The state can be manipulated using a global `setState`:

```html
<section x-state="false">
  <div class="prose mb-2">Value: <span x="state"></span></div>
  <button class="btn btn-blue" onclick="setState(v => !v)">Toggle value</button>
</section>
```

## Async evaluation

`x` supports promises. This is useful for complex evaluations:

```html
<section x-state="{ input: 'demo' }">
  <div class="prose mb-2">Value: <span x="complexOperation(state.input)"></span></div>
</section>
```

## Complex objects

State can be a complex object:

```html
<article x-state="{ amount: 1000, interest: 1.2 }">
  Total: <span x="state.amount * state.interest" />
</article>
```

> [The calculator example](#calculator) takes this idea further and shows how to handle user interaction.

## `x-if`

Sometimes it makes sense to hide entire fragments of a HTML structure. That's where `x-if` comes in:

```html
<div>
  <section x-state="true" x-if="state">I am visible</section>
  <section x-state="false" x-if="state">I am hidden</section>
  <section x-state="{ amount: 1000 }">
    <div x-if="state.amount > 500">I am visible</div>
    <div x-if="state.amount < 500">I am hidden</div>
  </section>
</div>
```

## `x-cloak`

`x-cloak` has been designed let you hide interactive content until Sidewind has loaded to avoid displaying markup that's not ready. Consider the example below:

```html
<article hidden x-cloak x-state="{ amount: 1000, interest: 1.2 }">
  Total: <span x="state.amount * state.interest" />
</article>
```

When it executes, it removes the [hidden](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/hidden) attribute from the element and it will be ready to run.
