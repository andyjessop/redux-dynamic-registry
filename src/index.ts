import {
  combineReducers,
  compose,
  Middleware,
  ReducersMapObject,
  MiddlewareAPI,
  Reducer,
  Store,
} from "redux";

export enum Statuses {
  ERROR,
  SUCCESS,
}

export type Unpacked<T> = T extends (infer U)[] ? U : T;
export type Object = Record<string, unknown>;

export type DynamicMiddlewareFn = {
  middleware: Middleware;
  add: (m: Middleware, order?: number) => void;
  remove: (middlewareFn: Middleware) => void;
};

export const createDynamicMiddleware = (
  middlewares: Middleware[] = []
): DynamicMiddlewareFn => ({
  middleware:
    <S>({ getState, dispatch }: MiddlewareAPI<S>) =>
      (next) =>
        (action) => {
          const middlewareAPI: MiddlewareAPI<S> = {
            getState,
            dispatch: (act) => dispatch(act),
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
    const index = middlewares.findIndex((d: Middleware) => d === middlewareFn);

    middlewares.splice(index, 1);
  },
})

export type DynamicReducerFn = {
  add: <S, N extends string>(
    store: Store<S>,
    reducer: Reducer<S>,
    namespace: N
  ) => Statuses;
  remove: <S, N extends string>(store: Store<S>, namespace: N) => Statuses;
};

export const createDynamicReducer = (
  reducerMap: ReducersMapObject = {}
): DynamicReducerFn => ({
  add: (store, reducer, namespace) => {
    if (namespace in reducerMap) {
      // Duplicate namespace provided.
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
