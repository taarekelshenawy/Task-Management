import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import getBaseUrl from '../utils/api';
import { apiClient } from '../utils/apiClient';

type User = {
  id: string;
  email: string;
  user_metadata?: any;
};

type stateProps = {
  loading: boolean;
  error: string | null;
  user: User | null;
};

const initialState: stateProps = {
  loading: false,
  error: null,
  user: null,
};

export const getUser = createAsyncThunk('auth/getUser', async (_, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;

  try {
    const response = await apiClient(getBaseUrl('auth/v1/user'));
    const data = await response.json();
    if (!response.ok) {
      return rejectWithValue(data?.msg || data?.error || 'Failed to get user');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('Unknown error');
  }
});

const User = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to get user';
      });
  },
});

export default User.reducer;
