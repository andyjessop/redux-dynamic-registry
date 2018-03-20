import { applyMiddleware, createStore } from 'redux';
import createRegistry from './index';

const dummyReducer = a => a;

describe('Redux Dynamic Registry', () => {
  test('should register reducer', () => {
    const store = createStore(dummyReducer);
    const registry = createRegistry();
    const reducer = (state, action) => ({ ...state, b: true });

    registry.registerReducer(store, reducer, 'a');

    store.dispatch({ type: 'test' });
    const state = store.getState();

    expect(state.a.b).toEqual(true);
  });

  test('should unregister reducer', () => {
    const store = createStore(dummyReducer);
    const registry = createRegistry();
    const reducer = (state = {}, action) => {
      if (action.type === 'test') {
        return { ...state, b: true };
      }
      return state;
    };

    registry.registerReducer(store, reducer, 'a');
    registry.unregisterReducer(store, 'a');

    store.dispatch({ type: 'test', payload: true });
    const state = store.getState();

    expect(state.a.b).toBeUndefined();
  });

  test('should register middleware', () => {
    let output = false;;

    const middleware = s => next => action => {
      output = true;
      next(action);
    };

    const registry = createRegistry();

    const store = createStore(
      dummyReducer,
      applyMiddleware(registry.dynamicMiddleware)
    );

    registry.registerMiddleware(middleware);

    store.dispatch({ type: 'test' });

    expect(output).toEqual(true);
  });

  test('should unregister middleware', () => {
    let output = false;

    const middleware = s => next => action => {
      output = true;
      next(action);
    };

    const registry = createRegistry();

    const store = createStore(
      dummyReducer,
      applyMiddleware(registry.dynamicMiddleware)
    );

    registry.registerMiddleware(middleware);
    registry.unregisterMiddleware(middleware);

    store.dispatch({ type: 'test' });

    expect(output).toEqual(false);
  });
});
