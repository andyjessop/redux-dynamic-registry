## Redux Dynamic Registry

Redux Dynamic Registry is a tool to dynamically add and remove reducers, middleware, and observers. It was conceived to aid code-splitting.

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

const myRegistry = registry(store);

myRegistry.registerModule(myModule, 'myName', 1); // The third parameter here is the order for the middleware (optional)

// And to unregister all middleware, reducer, and observers
myRegistry.unregisterModule('myName');

```

You can also register reducers, middleware, and observers separately:

```js
// Reducer
myRegistry.registerReducer(namespace, reducer);
myRegistry.unregisterReducer(namespace);

// Middleware
myRegistry.registerMiddleware(middleware, order);
myRegistry.unregisterMiddleware(middleware);

// Observer
const unregister = myRegistry.registerObserver(namespace, selector, onChange);
unregister();
```
