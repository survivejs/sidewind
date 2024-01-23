---
slug: "usage"
title: "Usage"
description: "Follow these instructions to use Sidewind"
---
The easiest way to use Sidewind, is to consume the bundle that includes all functionality. There are versions of Sidewind designed for this purpose - `tailwind/sidewind.umd.development.js` and `sidewind.umd.production.min.js`. Both include everything and runs the script above.

**Example:**

> `<script type="text/javascript" src="https://unpkg.com/sidewind/dist/sidewind.umd.production.min.js"></script>`

I recommend fixing the lookup to a specific version like this: `https://unpkg.com/sidewind@<version>/dist/sidewind.umd.production.min.js`. Doing this will avoid breakage in case a new major version is released.

## Programmatic API

Another way to use Sidewind, is to import it at a bootstrap script after installing it through a package manager: `import "sidewind";`.

Doing this will activate all included directives and expose the following API in the global scope:

- `getState(element: HTMLElement)` - Returns state found in the parents of the given element
- `setState(State | (state: State) => State, { element?: HTMLElement, parent?: string } )` - Sets state in the given element. If parent is given, then the state will be applied based on the label (see `x-label`).
- `evaluateAllDirectives(element?: HTMLElement)` - Evaluates all directives installed to the system. This can be useful if you are integrating Sidewind to an external system and want to trigger evaluation on load for example. For usage with limited contexts, such as Web Components, it's possible to pass an element to it. Otherwise it will evaluate against document body by default.

By design, Sidewind is modular and it's possible it will be packaged in a different way in the future so you get only the functionality you want. There's also room for tooling here as it's possible to write a preprocessor that can figure out the right imports based on use per page.

> All directives of the system have been implemented as plugins. For now, it's best to examine the framework source to see how it all goes together.

### `getState`

```html
<div class="flex flex-col gap-2">
  <section>
    <button class="btn btn-blue" x-label="parent" x-state="{ name: 'Hello' }" onclick="console.log(getState(this))" x="'Get state from self (' + parent.name + ')'"></button>
  </section>
  <section x-label="parent" x-state="{ name: 'Hello' }">
    <div x="parent.name"></div>
    <button class="btn btn-blue" onclick="console.log(getState(this))">
      Get state from parent
    </button>
  </section>
</div>
```

### `setState`

```html
<div class="flex flex-col gap-2">
  <section>
    <button class="btn btn-blue" x-label="parent" x-state="{ name: 'Hello' }" onclick="setState({ name: 'Bar' }, { element: this, parent: 'parent' })" x="'Set state to self (' + parent.name + ')'"></button>
  </section>
  <section x-label="parent" x-state="{ name: 'Hello' }">
    <div x="parent.name"></div>
    <button class="btn btn-blue" onclick="setState({ name: 'Bar' }, { element: this, parent: 'parent' })">
      Set state to parent
    </button>
  </section>
</div>
```
