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

export type CreateDynamicReducerFn = {
  add: <S, N extends string>(
    store: Store<S>,
    reducer: Reducer<S>,
    namespace: N
  ) => ActionStatus;
  remove: <S, N extends string>(store: Store<S>, namespace: N) => ActionStatus;
};

export enum ActionStatus {
  ERROR,
  SUCCESS,
}

export const createDynamicReducer = (
  rdcrs: ReducersMapObject = {}
): CreateDynamicReducerFn => {
  const reducers = rdcrs;

  return {
    add: (store, reducer, namespace) => {
      if (namespace in reducers) {
        // Duplicate namespace provided.
        return ActionStatus.ERROR;
      }

      reducers[namespace] = reducer;

      store.replaceReducer(combineReducers({ ...reducers }));

      return ActionStatus.SUCCESS;
    },

    remove: (store, namespace) => {
      if (namespace in reducers) {
        delete reducers[namespace];

        store.replaceReducer(combineReducers({ ...reducers }));

        return ActionStatus.SUCCESS;
      }

      return ActionStatus.ERROR;
    },
  };
};
