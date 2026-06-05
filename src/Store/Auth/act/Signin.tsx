import { createAsyncThunk } from "@reduxjs/toolkit";


type loginData = {
  email: string;
  password: string;
};

type LoginResponse = {
  access_token: string;
};

export const signIn = createAsyncThunk(
  "auth/login",
  async (data: loginData, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const response = await fetch(
        "https://ajqszvxwvobaedtlpewk.supabase.co/auth/v1/token?grant_type=password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_API_KEY,
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          result?.msg || result?.error || "Login failed"
        );
      }

      return result as LoginResponse;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Unknown error");
    }
  }
);