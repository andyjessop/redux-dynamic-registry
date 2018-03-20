import { combineReducers, compose } from 'redux';

export default () => {
  const middleware = [];
  const reducers = {};

  const dynamicMiddleware = ({ getState, dispatch }) => next => (action) => {
    const middlewareAPI = {
      getState,
      dispatch: act => dispatch(act),
    };

    const chain = middleware.map(m => m(middlewareAPI));

    return compose(...chain)(next)(action);
  };

  const registerMiddleware = (mdw, order) => {
    if (!order) {
      middleware.push(mdw);
    } else {
      middleware.splice(order, 0, mdw);
    }
  };

  const unregisterMiddleware = (middlewareFn) => {
    const index = middleware.findIndex(d => d === middlewareFn);

    middleware.splice(index, 1);
  };

  const registerReducer = (store, reducer, namespace) => {
    reducers[namespace] = compose(reducers[namespace] || (a => a), reducer);

    store.replaceReducer(combineReducers({ ...reducers }));
  };

  const unregisterReducer = (store, namespace) => {
    delete reducers[namespace];

    const stateKeys = Object.keys(store.getState());
    const reducerKeys = new Set(Object.keys(reducers));

    stateKeys
      .filter(key => !reducerKeys.has(key)) // state has a key that doesn't have a corresponding reducer
      .forEach(key => {
          reducers[key] = state => state === undefined ? null : state;
      });
    store.replaceReducer(combineReducers({ ...reducers }));
  };


  return {
    dynamicMiddleware,
    registerMiddleware,
    registerReducer,
    unregisterMiddleware,
    unregisterReducer,
  };
};
