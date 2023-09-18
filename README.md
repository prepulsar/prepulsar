# reactive

## Overview

The `reactive` function creates a reactive object that allows you to observe changes to a value and execute custom logic when the value is modified. This utility is particularly useful for building reactive data structures in JavaScript and TypeScript applications.

## Parameters

- `value` (required): The initial value to be wrapped within the reactive object.

- `options` (optional): An object containing configuration options for the reactive object.
  - `middleware` (optional): A function that can be used to intercept and modify the value before it's set.
  - `shouldChange` (optional): A function that determines whether the value should be changed. If this function returns `false`, the value won't be updated.

## Returns

A function that takes a `subscriber` function as an argument. This `subscriber` function will be called whenever the reactive value changes. The returned object contains the following properties:
- `proxy`: A Proxy object that wraps the reactive value. Changes to this value trigger the `subscriber` function.
- `unsubscribe`: A function that allows you to stop receiving updates from the `subscriber`. Calling this function removes the `subscriber` from the list of subscribers.

## Usage Example

```javascript
import { reactive } from 'prepulsar';

const reactiveState = reactive(42);

const { proxy, unsubscribe } = reactiveState((newValue) => {
  console.log('Value changed:', newValue);
});

// Modify the reactive value
proxy.value = 99; // This triggers the subscriber

// Stop receiving updates
unsubscribe();
