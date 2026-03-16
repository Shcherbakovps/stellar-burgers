import { combineReducers } from '@reduxjs/toolkit';
import { ingredientsReducer } from './slices/ingredients-slice';
import authReducer from './slices/auth-slice';
import ordersReducer from './slices/orders-slice';
import constructorReducer from './slices/constructor-slice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  auth: authReducer,
  orders: ordersReducer,
  burgerConstructor: constructorReducer
});
