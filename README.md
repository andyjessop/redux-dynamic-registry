## Redux Dynamic Registry

Redux Dynamic Registry is a tool to dynamically add and remove reducers and middleware. 
It was conceived to aid code-splitting.

It's very small, weighing-in at 8735B raw.

### Usage

```typescript
import { createStore } from 'redux';
import { createDynamicMiddleware, createDynamicReducer } from 'redux-dynamic-registry';

// Define dynamic middleware. 
const predefinedMiddlewares = []
const dynamicMiddleware = createDynamicMiddleware(...predefinedMiddlewares);

const store = createStore(
  reducer,
  applyMiddleware(
    dynamicMiddleware.middleware
  )
);

// Middleware usage.
dynamicMiddleware.add(middleware, order);
dynamicMiddleware.remove(middleware);

// Define dynamic reducer.
const dynamicReducer = createDynamicReducer();

// Reducer usage.
dynamicReducer.add(store, namespace, reducer);
dynamicReducer.remove(store, namespace);
```
