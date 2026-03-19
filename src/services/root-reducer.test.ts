import { rootReducer } from './root-reducer';

describe('rootReducer', () => {
  it('should return correct initial state', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual({
      ingredients: {
        items: [],
        isLoading: false,
        error: null
      },
      auth: {
        user: null,
        isAuthChecked: false,
        request: false,
        error: null
      },
      orders: {
        orders: [],
        userOrders: [],
        currentOrder: null,
        total: 0,
        totalToday: 0,
        isLoading: false,
        error: null,
        wsConnected: false,
        wsError: null
      },
      burgerConstructor: {
        bun: null,
        ingredients: []
      }
    });
  });
});

