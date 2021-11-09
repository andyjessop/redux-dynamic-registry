import {
  combineReducers,
  compose,
  Middleware,
  MiddlewareAPI,
  ReducersMapObject,
  Reducer,
  Store,
} from "redux";

type Unpacked<T> = T extends (infer U)[] ? U : T;

type DynamicMiddleware = {
  middleware: Middleware;
  add: (m: Middleware, order: number) => void;
  remove: (middlewareFn: Middleware) => void;
};

export const createDynamicMiddleware = (
  m: Middleware[] = []
): DynamicMiddleware => {
  const mdw = m;

  return {
    middleware:
      <S>({ getState, dispatch }: MiddlewareAPI<S>) =>
      (next) =>
      (action) => {
        const middlewareAPI: MiddlewareAPI<S> = {
          getState,
          dispatch: (act) => dispatch(act),
        };

        const chain = mdw.map((m) => m(middlewareAPI));
        const chained = compose(...chain) as Unpacked<typeof chain>;

        return chained(next)(action);
      },

    add: (m, order) => {
      if (!order) {
        mdw.push(m);
      } else {
        mdw.splice(order, 0, m);
      }
    },

    remove: (middlewareFn) => {
      const index = mdw.findIndex((d: Middleware) => d === middlewareFn);

      mdw.splice(index, 1);
    },
  };
};

const defaultReducer = <S, A>(s: S, _a: A): S => s;

export type CreateDynamicReducerFn = {
  add: <S, N extends string>(
    store: Store<S>,
    reducer: Reducer<S>,
    namespace: N
  ) => void;
  remove: <S, N extends string>(store: Store<S>, namespace: N) => void;
};

export const createDynamicReducer = (
  rdcrs: ReducersMapObject = {}
): CreateDynamicReducerFn => {
  const reducers = rdcrs;

  return {
    add: (store, reducer, namespace) => {
      reducers[namespace] = compose(
        reducers[namespace] ?? defaultReducer,
        reducer
      );

      store.replaceReducer(combineReducers({ ...reducers }));
    },

    remove: <S, N extends string>(store: Store<S>, namespace: N): void => {
      delete reducers[namespace];

      const stateKeys = Object.keys(store.getState());
      const reducerKeys = new Set(Object.keys(reducers));

      stateKeys
        .filter((key) => !reducerKeys.has(key)) // state has a key that doesn't have a corresponding reducer
        .forEach((key) => {
          reducers[key] = (state) => (state === undefined ? null : state);
        });
      store.replaceReducer(combineReducers({ ...reducers }));
    },
  };
};
