# reactive

## Overview

The `reactive` function creates a reactive object that allows you to observe changes to a value and execute custom logic when the value is modified. This utility is particularly useful for building reactive data structures in JavaScript and TypeScript applications.

## Parameters

- `value` (required): The initial value to be wrapped within the reactive object.


- `options` (optional): 
  An object containing configuration options for the reactive state.

- `options.middleware?: (oldValue: T, newValue: T) => T` 
  (optional): A function that will be called whenever the reactive state is updated with the old value and the new value of the reactive state. This function can be used to perform side effects whenever the reactive state is updated. 

  The returned value will be the new state.

  ```javascript
  reactive(0, {
    middleware: (oldValue, newValue) => {
      // do something else
      doSomethingElse(oldValue, newValue);
      
      // we always return the value + 2
      return newValue + 2;
    },
  });
  ```

- `options.shouldChange?: (oldValue: T, newValue: T) => boolean` (optional)
  A function that will be called whenever the reactive state is updated with the old value and the new value of the reactive state. This function can be used to determine whether or not the reactive state should be updated. If this function returns `false`, the reactive state will not be updated.

  This function runs after the `middleware` function.

  ```javascript
  reactive(0, {
    shouldChange: (oldValue, newValue) => {
      // update the state only if the new value is greater than 10
      return newValue < 10;
    },
  });
  ```

## Returns

A function that takes a `subscriber` function as an argument. This `subscriber` function will be called whenever the reactive value changes. The returned object contains the following properties:
- `proxy: Proxy<T>`
  A Proxy object that wraps the reactive value. Changes to this value trigger the `subscriber` function.

- `unsubscribe: () => void`
  A function that allows you to stop receiving updates from the `subscriber`. Calling this function removes the `subscriber` from the list of subscribers.

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
