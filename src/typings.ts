/**
 * @file Contains types for core handlers and their associated utility helpers.
 * @author Urmzd Mukhammadnaim <urmzd@dal.ca>
 * @since 2022-11-19
 */
import { Middleware, Store, Reducer, ReducersMapObject } from "redux";
import { Statuses } from "src/constants";

export type DynamicMiddlewareFn = (middleware?: Middleware[]) => {
  middleware: Middleware;
  add: (m: Middleware, order?: number) => void;
  remove: (middlewareFn: Middleware) => void;
};

export type DynamicReducerFn = (reducerMap?: ReducersMapObject) => {
  add: <N extends string>(
    store: Store,
    reducer: Reducer,
    namespace: N
  ) => Statuses;
  remove: <N extends string>(store: Store, namespace: N) => Statuses;
};

export type Unpacked<T> = T extends (infer U)[] ? U : T;
export type Object = Record<string, any>;
