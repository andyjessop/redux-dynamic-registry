import {
  Action,
  applyMiddleware,
  createStore,
  Middleware,
  Reducer,
} from "redux";
import {
  createDynamicMiddleware,
  createDynamicReducer,
} from "src/index";

const dummyReducer: Reducer = (a = {}) => a;

describe("Redux Dynamic Registry", () => {
  test("should register reducer", () => {
    const store = createStore(dummyReducer, {});

    const reducer = <S, A>(state: S, _action: A) => ({ ...state, b: true });

    const dynamicReducer = createDynamicReducer();
    dynamicReducer.add(store, reducer, "a");

    store.dispatch({ type: "test" });
    const state = store.getState();

    expect((state?.a as ReturnType<typeof reducer>)?.b).toEqual(true);
  });

  test("should unregister reducer", () => {
    const store = createStore(dummyReducer, {});

    const reducer = <A extends Action>(state: Object = {}, action: A) => {
      if (action.type === "test") {
        return { ...state, b: true };
      }

      return state;
    };

    const dynamicReducer = createDynamicReducer();
    dynamicReducer.add(store, reducer, "a");
    dynamicReducer.remove(store, "a");

    store.dispatch({ type: "test", payload: true });
    const state = store.getState();

    expect(state?.a?.b).toBeUndefined();
  });

  test("should register middleware", () => {
    let output = false;

    const middleware: Middleware = (_s) => (next) => (action) => {
      output = true;
      next(action);
      return action;
    };

    const dynamicMiddleware = createDynamicMiddleware();

    const store = createStore(
      dummyReducer,
      applyMiddleware(dynamicMiddleware.middleware)
    );

    dynamicMiddleware.add(middleware);

    store.dispatch({ type: "test" });

    expect(output).toEqual(true);
  });

  test("should unregister middleware", () => {
    let output = false;

    const middleware: Middleware = (_s) => (next) => (action) => {
      output = true;
      next(action);
      return action;
    };

    const dynamicMiddleware = createDynamicMiddleware();

    const store = createStore(
      dummyReducer,
      applyMiddleware(dynamicMiddleware.middleware)
    );

    dynamicMiddleware.add(middleware);
    dynamicMiddleware.remove(middleware);

    store.dispatch({ type: "test" });

    expect(output).toEqual(false);
  });
});
