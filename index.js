import { combineReducers, compose } from 'redux';

export const createDynamicMiddleware = (m) => {
  let mdw = m || [];

  return {
    middleware: ({ getState, dispatch }) => next => (action) => {
      const middlewareAPI = {
        getState,
        dispatch: act => dispatch(act),
      };

      const chain = mdw.map(m => m(middlewareAPI));

      return compose(...chain)(next)(action);
    },

    add: (m, order) => {
      if (!order) {
        mdw.push(m);
      } else {
        mdw.splice(order, 0, m);
      }
    },

    remove: (middlewareFn) => {
      const index = mdw.findIndex(d => d === middlewareFn);

      mdw.splice(index, 1);
    },
  }
};

export const createDynamicReducer = rdcrs => {
  let reducers = rdcrs || {};

  return {
    add: (store, reducer, namespace) => {
      reducers[namespace] = compose(reducers[namespace] || (a => a), reducer);

      store.replaceReducer(combineReducers({ ...reducers }));
    },

    remove: (store, namespace) => {
      delete reducers[namespace];

      const stateKeys = Object.keys(store.getState());
      const reducerKeys = new Set(Object.keys(reducers));

      stateKeys
        .filter(key => !reducerKeys.has(key)) // state has a key that doesn't have a corresponding reducer
        .forEach(key => {
            reducers[key] = state => state === undefined ? null : state;
        });
      store.replaceReducer(combineReducers({ ...reducers }));
    },
  }
};
