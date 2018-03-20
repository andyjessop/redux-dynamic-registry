## Redux Dynamic Registry

Redux Dynamic Registry is a tool to dynamically add and remove reducers and middleware. It was conceived to aid code-splitting.

It's very small, weighing-in <600B minified and gzipped.

### Usage

```js
import { createStore } from 'redux';
import { createDynamicMiddleware, createDynamicReducer } from 'redux-dynamic-registry';

// Middleware
const dynamicMiddleware = createDynamicMiddleware();

const store = createStore(
  reducer,
  applyMiddleware(
    // ...other app middleware,
    dynamicMiddleware.middleware
  )
);

dynamicMiddleware.add(middleware, order);
dynamicMiddleware.remove(middleware);

// Reducer
const dynamicReducer = createDynamicReducer();
dynamicReducer.add(store, namespace, reducer);
dynamicReducer.remove(store, namespace);

```
