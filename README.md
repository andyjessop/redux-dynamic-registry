## Redux Dynamic Registry

Redux Dynamic Registry is a tool to dynamically add and remove reducers, middleware, and observers. It was conceived to aid code-splitting.

It's very small, weighing-in < 1KB minified and < 1KB (minified and gzipped).

You can register all of the above as a module:

```js
import { createStore } from 'redux';
import registry from 'redux-dynamic-registry';
import myModule from './my-module';

// myModule: {
//   middleware: [function],
//   reducer: function,
//   observers: [{ namespace: string, selector: function, onChange: function }]
// }

const store = createStore(...);

const myRegistry = registry();

myRegistry.registerModule(store, myModule, 'myName', 1); // The third parameter here is the order for the middleware (optional)

// And to unregister all middleware, reducer, and observers
myRegistry.unregisterModule(store, 'myName');

```

You can also register reducers, middleware, and observers separately:

```js
// Reducer
myRegistry.registerReducer(store, namespace, reducer);
myRegistry.unregisterReducer(store, namespace);

// Middleware
const myRegistry = registry();
const store = createStore(
  reducer,
  applyMiddleware(myRegistry.middleware)
);

// As the dynamic middleware is already applied to the store, we don't need to
// pass it here.
myRegistry.registerMiddleware(middleware, order);
myRegistry.unregisterMiddleware(middleware);

// Observer
const unregister = myRegistry.registerObserver(store, namespace, selector, onChange);
unregister();
```
