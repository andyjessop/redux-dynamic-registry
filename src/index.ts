import { combineReducers, compose, MiddlewareAPI } from "redux";
import { DynamicMiddlewareFn, DynamicReducerFn, Unpacked } from "src/typings";
import { Statuses } from "src/constants";

export const createDynamicMiddleware: DynamicMiddlewareFn = (
  middlewares = []
) => ({
  middleware:
    ({ getState, dispatch }) =>
    (next) =>
    (action) => {
      const middlewareAPI: MiddlewareAPI = {
        getState,
        dispatch: (action) => dispatch(action),
      };

      const chain = middlewares.map((m) => m(middlewareAPI));
      const chained = compose(...chain) as Unpacked<typeof chain>;

      return chained(next)(action);
    },

  add: (middleware, order) => {
    if (!order) {
      middlewares.push(middleware);
    } else {
      middlewares.splice(order, 0, middleware);
    }
  },

  remove: (middlewareFn) => {
    const index = middlewares.findIndex((d) => d === middlewareFn);

    middlewares.splice(index, 1);
  },
});

export const createDynamicReducer: DynamicReducerFn = (reducerMap = {}) => ({
  add: (store, reducer, namespace) => {
    if (namespace in reducerMap) {
      return Statuses.ERROR;
    }

    reducerMap[namespace] = reducer;

    store.replaceReducer(combineReducers({ ...reducerMap }));

    return Statuses.SUCCESS;
  },

  remove: (store, namespace) => {
    if (namespace in reducerMap) {
      delete reducerMap[namespace];

      store.replaceReducer(combineReducers({ ...reducerMap }));

      return Statuses.SUCCESS;
    }

    return Statuses.ERROR;
  },
});
