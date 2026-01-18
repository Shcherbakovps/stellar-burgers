import { createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '@utils-types';
import { getOrdersApi, getFeedsApi, getOrderByNumberApi } from '@api';

type OrdersState = {
  orders: TOrder[];
  userOrders: TOrder[];
  currentOrder: TOrder | null;
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
  wsConnected: boolean;
  wsError: string | null;
};

const initialState: OrdersState = {
  orders: [],
  userOrders: [],
  currentOrder: null,
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null,
  wsConnected: false,
  wsError: null
};

// Action types
export const WS_FEED_CONNECTION_START = 'orders/wsFeedConnectionStart';
export const WS_FEED_CONNECTION_SUCCESS = 'orders/wsFeedConnectionSuccess';
export const WS_FEED_CONNECTION_ERROR = 'orders/wsFeedConnectionError';
export const WS_FEED_CONNECTION_CLOSED = 'orders/wsFeedConnectionClosed';
export const WS_FEED_GET_MESSAGE = 'orders/wsFeedGetMessage';

export const WS_USER_ORDERS_CONNECTION_START =
  'orders/wsUserOrdersConnectionStart';
export const WS_USER_ORDERS_CONNECTION_SUCCESS =
  'orders/wsUserOrdersConnectionSuccess';
export const WS_USER_ORDERS_CONNECTION_ERROR =
  'orders/wsUserOrdersConnectionError';
export const WS_USER_ORDERS_CONNECTION_CLOSED =
  'orders/wsUserOrdersConnectionClosed';
export const WS_USER_ORDERS_GET_MESSAGE = 'orders/wsUserOrdersGetMessage';

export const SET_CURRENT_ORDER = 'orders/setCurrentOrder';
export const CLEAR_ORDERS = 'orders/clearOrders';

// Action creators
export const wsFeedConnectionStart = () => ({ type: WS_FEED_CONNECTION_START });
export const wsFeedConnectionSuccess = () => ({
  type: WS_FEED_CONNECTION_SUCCESS
});
export const wsFeedConnectionError = (payload: string) => ({
  type: WS_FEED_CONNECTION_ERROR,
  payload
});
export const wsFeedConnectionClosed = () => ({
  type: WS_FEED_CONNECTION_CLOSED
});
export const wsFeedGetMessage = (payload: TOrdersData) => ({
  type: WS_FEED_GET_MESSAGE,
  payload
});

export const wsUserOrdersConnectionStart = () => ({
  type: WS_USER_ORDERS_CONNECTION_START
});
export const wsUserOrdersConnectionSuccess = () => ({
  type: WS_USER_ORDERS_CONNECTION_SUCCESS
});
export const wsUserOrdersConnectionError = (payload: string) => ({
  type: WS_USER_ORDERS_CONNECTION_ERROR,
  payload
});
export const wsUserOrdersConnectionClosed = () => ({
  type: WS_USER_ORDERS_CONNECTION_CLOSED
});
export const wsUserOrdersGetMessage = (payload: { orders: TOrder[] }) => ({
  type: WS_USER_ORDERS_GET_MESSAGE,
  payload
});

export const setCurrentOrder = (payload: TOrder | null) => ({
  type: SET_CURRENT_ORDER,
  payload
});
export const clearOrders = () => ({ type: CLEAR_ORDERS });

// Async thunks
export const getAllOrders = createAsyncThunk(
  'orders/getAllOrders',
  async () => await getFeedsApi()
);

export const getUserOrders = createAsyncThunk(
  'orders/getUserOrders',
  async () => await getOrdersApi()
);

export const getOrderByNumber = createAsyncThunk(
  'orders/getOrderByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    return response.orders[0];
  }
);

// Reducer with switch case
const ordersReducer = (state = initialState, action: any): OrdersState => {
  switch (action.type) {
    // WebSocket Feed actions
    case WS_FEED_CONNECTION_START:
      return {
        ...state,
        wsConnected: false,
        wsError: null
      };

    case WS_FEED_CONNECTION_SUCCESS:
      return {
        ...state,
        wsConnected: true,
        wsError: null
      };

    case WS_FEED_CONNECTION_ERROR:
      return {
        ...state,
        wsConnected: false,
        wsError: action.payload
      };

    case WS_FEED_CONNECTION_CLOSED:
      return {
        ...state,
        wsConnected: false
      };

    case WS_FEED_GET_MESSAGE:
      return {
        ...state,
        orders: action.payload.orders,
        total: action.payload.total,
        totalToday: action.payload.totalToday
      };

    // WebSocket User Orders actions
    case WS_USER_ORDERS_CONNECTION_START:
      return {
        ...state,
        wsConnected: false,
        wsError: null
      };

    case WS_USER_ORDERS_CONNECTION_SUCCESS:
      return {
        ...state,
        wsConnected: true,
        wsError: null
      };

    case WS_USER_ORDERS_CONNECTION_ERROR:
      return {
        ...state,
        wsConnected: false,
        wsError: action.payload
      };

    case WS_USER_ORDERS_CONNECTION_CLOSED:
      return {
        ...state,
        wsConnected: false
      };

    case WS_USER_ORDERS_GET_MESSAGE:
      return {
        ...state,
        userOrders: action.payload.orders
      };

    // Other actions
    case SET_CURRENT_ORDER:
      return {
        ...state,
        currentOrder: action.payload
      };

    case CLEAR_ORDERS:
      return {
        ...state,
        orders: [],
        userOrders: [],
        currentOrder: null,
        total: 0,
        totalToday: 0
      };

    // getAllOrders
    case getAllOrders.pending.type:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case getAllOrders.fulfilled.type:
      return {
        ...state,
        isLoading: false,
        orders: action.payload.orders,
        total: action.payload.total,
        totalToday: action.payload.totalToday
      };

    case getAllOrders.rejected.type:
      return {
        ...state,
        isLoading: false,
        error: action.error.message || 'Произошла ошибка'
      };

    // getUserOrders
    case getUserOrders.pending.type:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case getUserOrders.fulfilled.type:
      return {
        ...state,
        isLoading: false,
        userOrders: action.payload
      };

    case getUserOrders.rejected.type:
      return {
        ...state,
        isLoading: false,
        error: action.error.message || 'Произошла ошибка'
      };

    // getOrderByNumber
    case getOrderByNumber.pending.type:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case getOrderByNumber.fulfilled.type:
      return {
        ...state,
        isLoading: false,
        currentOrder: action.payload
      };

    case getOrderByNumber.rejected.type:
      return {
        ...state,
        isLoading: false,
        error: action.error.message || 'Произошла ошибка'
      };

    default:
      return state;
  }
};

export default ordersReducer;
