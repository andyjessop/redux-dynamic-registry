## Redux Dynamic Registry

Redux Dynamic Registry is a tool to dynamically add and remove reducers and middleware. It was conceived to aid code-splitting.

It's very small, weighing-in <1KB minified and gzipped.

### Usage

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
```
