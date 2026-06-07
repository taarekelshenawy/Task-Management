import { createAsyncThunk } from '@reduxjs/toolkit';

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (data: { email: string }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const response = await fetch(
        'https://ajqszvxwvobaedtlpewk.supabase.co/auth/v1/recover',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: import.meta.env.VITE_API_KEY,
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
