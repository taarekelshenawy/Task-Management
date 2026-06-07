import { createAsyncThunk } from '@reduxjs/toolkit';

type stateProps = {
  loading: boolean;
  error: string | null;
  token: string;
  signupSuccess: boolean;
  loginSuccess: boolean;
  forgotSuccess: boolean;
  logoutSuccess: boolean;
};

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (data: { password: string }, thunkAPI) => {
    const { rejectWithValue, getState } = thunkAPI;
    const state = getState() as { Auth: stateProps };

    try {
      const response = await fetch(
        'https://ajqszvxwvobaedtlpewk.supabase.co/auth/v1/user',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            apikey: import.meta.env.VITE_API_KEY,
            Authorization: `Bearer ${state.Auth.token}`,
          },
          body: JSON.stringify(data),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          result?.error_description ||
            result?.error ||
            'Failed to send reset email',
        );
      }

      return result;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Unknown error');
    }
  },
);
