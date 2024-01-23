---
slug: "labels"
title: "Labels"
description: "Labels give easy access to parent state"
---
To allow more complex access across different data stores, labels are supported. In other words, you can name state containers and then access them where you need. The feature is comparable to React context and the use case is similar.

## `x-label`

`x-label` gives access to parent state and it's useful for sharing information between scopes.

```html
<div x-label="i18n" x-state="{ hello: 'Terve' }">
  <div x-state="{ world: 'World' }">
    <span x="i18n.hello + ' ' + state.world" />
  </div>
</div>
```

## Setting parent state from a child

It's also possible to set the parent state from a child. This allows you to nest state within state while being able to mutate it.

```html
<div x-label="parent" x-state="'parent state'">
  <div>Parent state in between: <span x="parent" /></div>
  <div class="space-y-2" x-state="'child state'">
    <div>Parent state: <span x="parent" /></div>
    <div>Child state: <span x="state" /></div>
    <button
      class="btn btn-blue"
      onclick="setState('Changed parent', { parent: 'parent' })"
    >
      Change parent state
    </button>
    <button class="btn btn-blue" onclick="setState('Changed child')">
      Change child state
    </button>
    <button
      class="btn btn-blue"
      onclick="setState('Changed both') || setState('Changed both', { parent: 'parent' })"
    >
      Change both
    </button>
  </div>
</div>
```

## Nested labels

The nested behavior works for attributes as well.

```html
<div x-label="parent" x-state="true">
  <div class="space-y-2" x-state="true">
    <div x-attr class="p-2" @class="parent ? 'bg-red-400' : 'bg-red-200'">
      Parent
    </div>
    <div x-attr class="p-2" @class="state ? 'bg-gray-400' : 'bg-gray-200'">
      Child
    </div>
    <div class="flex space-x-2">
      <button
        class="btn btn-blue"
        onclick="setState(state => !state, { parent: 'parent' })"
      >
        Change parent class
      </button>
      <button class="btn btn-blue" onclick="setState(state => !state)">
        Change child class
      </button>
      <button
        class="btn btn-blue"
        onclick="setState(state => !state) || setState(state => !state, { parent: 'parent' })"
      >
        Change classes for both
      </button>
    </div>
  </div>
</div>
```

## Labels during iteration

The labeled data is available at `x-each` as well:

```html
<div x-label="parent" x-state="{ message: 'Hello' }">
  <div
    x-state="{
    todos: [
      { text: 'Wash dishes' }, { text: 'Eat carrots' }
    ]
  }"
  >
    <div class="flex flex-col gap-2">
      <ul class="list-disc list-inside" x-each="state.todos">
        <li x-template x="parent.message + ': ' + state.value.text"></li>
      </ul>
    </div>
    <div x="JSON.stringify(state.todos, null, 2)"></div>
  </div>
</div>
```

## Deriving state

State can also be derived to compose or enhance it.

```html
<section x-label="parent" x-state="{ name: 'Hello' }">
  <div>Value: <span x="state.name"></span></div>
  <div x-state="{ longerName: parent.name + ' again' }">
    <div>Value: <span x="state.longerName"></span></div>
    <button
      class="btn btn-blue mb-2"
      onclick="setState({ name: 'Hi' }, { parent: 'parent' })"
    >
      Change to hi from within
    </button>
  </div>
  <button class="btn btn-blue" onclick="setState({ name: 'Morning' })">
    Change to morning
  </button>
  <button class="btn btn-blue" onclick="setState({ name: 'Goodbye' })">
    Change to goodbye
  </button>
</section>
```

## JavaScript API

The same works with the JavaScript API.

```html
<section x-label="parent" x-state="{ name: 'Hello' }">
  <div x-label="child" x-state="{ value: 'you' }">
    <div>Value: <span x="parent.name"></span></div>
    <div x-state="{ longerName: parent.name + ' ' + child.value }">
      <div>Value: <span x="state.longerName"></span></div>
      <button class="btn btn-blue mb-2" onclick="hiClicked(this)">
        Change to hi from within
      </button>
      <button class="btn btn-blue mb-2" onclick="bothClicked(this)">
        Change both from within
      </button>
      <button
        class="btn btn-blue"
        onclick="setState({ value: 'me' }, { parent: 'child' })"
      >
        Change to me
      </button>
    </div>
  </div>
  <button class="btn btn-blue" onclick="morningClicked(this)">
    Change to morning
  </button>
  <button class="btn btn-blue" onclick="goodbyeClicked(this)">
    Change to goodbye
  </button>
</section>
```

## Multiple labels at once

Also multiple labels are supported.

```html
<section x-label="editor" x-state="{ page: 'Hello' }">
  <div x-label="selected" x-state="{ componentId: '123' }">
    <div x="editor.page"></div>
    <div x="editor.page + ' ' + selected.componentId"></div>
    <div x="selected.componentId"></div>
    <button
      class="btn btn-blue"
      onclick="setState({ page: 'Morning' }, { parent: 'editor' })"
    >
      Change only page to morning
    </button>
    <button
      class="btn btn-blue"
      onclick="setState({ componentId: '321' }, { parent: 'selected' })"
    >
      Change only component id to 321
    </button>
  </div>
</section>
```

