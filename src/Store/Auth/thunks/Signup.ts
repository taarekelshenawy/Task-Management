import { createAsyncThunk } from '@reduxjs/toolkit';
import getBaseUrl from '../../../utils/api';

type signUpData = {
  email: string;
  password: string;
  confirmPassword: string;
  data: {
    name: string;
    department: string;
  };
};

export const Signup = createAsyncThunk(
  'auth/signup',
  async (payload: signUpData, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const response = await fetch(
        getBaseUrl('auth/v1/signup'),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: import.meta.env.VITE_API_KEY,
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data?.msg || data?.error || 'Signup failed');
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Unknown error');
    }
  },
);
