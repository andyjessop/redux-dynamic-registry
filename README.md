## Redux Dynamic Registry

Redux Dynamic Registry is a tool to dynamically add and remove reducers and middleware. It was conceived to aid code-splitting.

It's very small, weighing-in <1KB minified and gzipped.

### Usage

```js
import { createStore } from 'redux';
import createRegistry from 'redux-dynamic-registry';

// Middleware
const myRegistry = createRegistry();

const store = createStore(
  reducer,
  applyMiddleware(
    // ...other app middleware,
    myRegistry.middleware
  )
);

myRegistry.registerMiddleware(middleware, order);
myRegistry.unregisterMiddleware(middleware);

// Reducer
myRegistry.registerReducer(store, namespace, reducer);
myRegistry.unregisterReducer(store, namespace);

```
