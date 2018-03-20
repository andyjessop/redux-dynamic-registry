import { createStore } from 'redux';
import createRegistry from './index';

let registry;
let store;

describe('Redux Dynamic Registry', () => {
  beforeEach(() => {
    store = createStore(a => a);
    registry = createRegistry(store);
  });

  test('should register reducer', () => {
    const reducer = (state, action) => ({ ...state, b: true });

    registry.registerReducer(reducer, 'a');

    store.dispatch({ type: 'test' });
    const state = store.getState();

    expect(state.a.b).toEqual(true);
  });
});
