---
slug: "usage"
title: "Usage"
---

The easiest way to use Sidewind, is to consume the bundle that includes all functionality. There are versions of Sidewind designed for this purpose - `tailwind/sidewind.umd.development.js` and `sidewind.umd.production.min.js`. Both include everything and runs the script above.

**Example:**

> `<script type="text/javascript" src="https://unpkg.com/sidewind@5.4.6/dist/sidewind.umd.production.min.js"></script>`

## Programmatic API

Another way to use Sidewind, is to import it at a bootstrap script after installing it through a package manager: `import "sidewind";`.

Doing this will activate all included directives and expose the following API in the global scope:

- `getState(element: HTMLElement)` - Returns state found in the parents of the given element
- `setState(State | (state: State) => State, { element?: HTMLElement, parent?: string } )` - Sets state in the given element. If parent is given, then the state will be applied based on the label (see `x-label`).
- `evaluateAllDirectives()` - Evaluates all directives installed to the system. This can be useful if you are integrating Sidewind to an external system and want to trigger evaluation on load for example.

By design, Sidewind is modular and it's possible it will be packaged in a different way in the future so you get only the functionality you want. There's also room for tooling here as it's possible to write a preprocessor that can figure out the right imports based on use per page.

> All directives of the system have been implemented as plugins. For now, it's best to examine the framework source to see how it all goes together.