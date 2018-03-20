import { combineReducers, compose } from 'redux';

export default (store) => {
  const middleware = [];
  const observers = {};
  const reducers = {};

  const dynamicMiddleware = ({ getState, dispatch }) => next => (action) => {
    const middlewareAPI = {
      getState,
      dispatch: act => dispatch(act),
    };

    const chain = middleware.map(m => m(middlewareAPI));

    return compose(...chain)(next)(action);
  };

  const registerMiddleware = (middlewares, order) => {
    middleware.splice(order, 0, ...middlewares);
  };

  const unregisterMiddleware = (middlewareFn) => {
    const index = middleware.findIndex(d => d === middlewareFn);

    middleware.splice(index, 1);
  };

  const registerReducer = (reducer, namespace) => {
    reducers[namespace] = compose(reducers[namespace] || (a => a), reducer);

    store.replaceReducer(combineReducers(reducers));
  };

  const unregisterReducer = (namespace) => {
    delete reducers[namespace];
    store.replaceReducer(combineReducers(reducers));
  };

  const registerObserver = (key, selector, onChange) => {
    let currentState;

    const handleChange = () => {
      const state = store.getState();
      const nextState = selector(state[key]);

      if (nextState !== currentState) {
        onChange({
          state: state[key],
          store,
          currentState: nextState,
          previousState: currentState,
        });
        currentState = nextState;
      }
    };

    const unsubscribe = store.subscribe(handleChange);
    handleChange();

    return unsubscribe;
  };

  const registerModule = (module, namespace, middlewareOrder) => {
    if (module.reducer) {
      registerReducer(module.reducer, namespace);
    }

    if (module.observers) {
      if (!observers[namespace]) {
        observers[namespace] = [];
      }

      [...module.observers].forEach(obs =>
        observers[namespace].push(registerObserver(obs.namespace, obs.selector, obs.onChange)),
      );
    }

    if (module.middleware) {
      registerMiddleware(module.middleware, middlewareOrder);
    }
  };

  const unregisterModule = (namespace) => {
    unregisterReducer(namespace);

    [...observers[namespace]].forEach((obs) => {
      obs();
      delete observers[namespace];
    });

    [...module.middleware].forEach(mdw => unregisterMiddleware(mdw));
  };


  return {
    dynamicMiddleware,
    registerMiddleware,
    registerModule,
    registerObserver,
    registerReducer,
    unregisterMiddleware,
    unregisterModule,
    unregisterReducer,
  };
};
