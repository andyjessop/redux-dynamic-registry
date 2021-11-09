import { applyMiddleware, createStore } from 'redux';
import createRegistry from './index';
import {
  createDynamicMiddleware,
  createDynamicReducer,
} from './index';

const dummyReducer = a => a;

describe('Redux Dynamic Registry', () => {
  test('should register reducer', () => {
    const store = createStore(dummyReducer);

    const reducer = (state, action) => ({ ...state, b: true });

    const dynamicReducer = createDynamicReducer();
    dynamicReducer.add(store, reducer, 'a');

    store.dispatch({ type: 'test' });
    const state = store.getState();

    expect(state.a.b).toEqual(true);
  });

  test('should unregister reducer', () => {
    const store = createStore(dummyReducer);

    const reducer = (state = {}, action) => {
      if (action.type === 'test') {
        return { ...state, b: true };
      }
      return state;
    };

    const dynamicReducer = createDynamicReducer();
    dynamicReducer.add(store, reducer, 'a');
    dynamicReducer.remove(store, 'a');

    store.dispatch({ type: 'test', payload: true });
    const state = store.getState();

    expect(state.a.b).toBeUndefined();
  });

  test('should register middleware', () => {
    let output = false;

    const middleware = s => next => action => {
      output = true;
      next(action);
    };

    const dynamicMiddleware = createDynamicMiddleware();

    const store = createStore(
      dummyReducer,
      applyMiddleware(dynamicMiddleware.middleware)
    );

    dynamicMiddleware.add(middleware);

    store.dispatch({ type: 'test' });

    expect(output).toEqual(true);
  });

  test('should unregister middleware', () => {
    let output = false;

    const middleware = s => next => action => {
      output = true;
      next(action);
    };

    const dynamicMiddleware = createDynamicMiddleware();

    const store = createStore(
      dummyReducer,
      applyMiddleware(dynamicMiddleware.middleware)
    );

    dynamicMiddleware.add(middleware);
    dynamicMiddleware.remove(middleware);

    store.dispatch({ type: 'test' });

    expect(output).toEqual(false);
  });
});
