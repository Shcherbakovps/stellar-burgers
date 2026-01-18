import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  loginUserApi,
  registerUserApi,
  logoutApi,
  getUserApi,
  updateUserApi,
  TLoginData,
  TRegisterData
} from '@api';

import { TUser } from '@utils-types';

type AuthState = {
  user: TUser | null;
  isAuthChecked: boolean;
  request: boolean;
  error: string | null;
};

const initialState: AuthState = {
  user: null,
  isAuthChecked: false,
  request: false,
  error: null
};

// 🔐 логин
export const loginUser = createAsyncThunk(
  'auth/login',
  async (data: TLoginData, { rejectWithValue }) => {
    try {
      return await loginUserApi(data);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// 📝 регистрация
export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: TRegisterData, { rejectWithValue }) => {
    try {
      return await registerUserApi(data);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// 👤 получить пользователя
export const getUser = createAsyncThunk(
  'auth/getUser',
  async (_, { rejectWithValue }) => {
    try {
      return await getUserApi();
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// 🚪 logout
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// ✏️ обновить пользователя
export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (data: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      return await updateUserApi(data);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // login
      .addCase(loginUser.pending, (state) => {
        state.request = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.request = false;
        state.user = action.payload.user;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.request = false;
        state.error = action.payload as string;
      })

      // register
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthChecked = true;
      })

      // getUser
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthChecked = true;
      })
      .addCase(getUser.rejected, (state) => {
        state.isAuthChecked = true;
      })

      // logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthChecked = true;
      })

      // updateUser
      .addCase(updateUser.pending, (state) => {
        state.request = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.request = false;
        state.user = action.payload.user;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.request = false;
        state.error = action.payload as string;
      });
  }
});

export default authSlice.reducer;
