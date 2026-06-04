import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

/* =======================
   TYPES
======================= */

type User = {
  id: string;
  email: string;
  user_metadata?: any;
};

type stateProps = {
  loading: boolean;
  error: string | null;
  user: User | null;
  token: string;
};

/* =======================
   INITIAL STATE
======================= */

const initialState: stateProps = {
  loading: false,
  error: null,
  user: null,
  token: "",
};

/* =======================
   GET USER
======================= */

export const getUser = createAsyncThunk(
  "auth/getUser",
  async (_, thunkAPI) => {
    const { rejectWithValue, getState } = thunkAPI;

    try {
      const state = getState() as { Auth: stateProps };
      console.log(state.Auth.token)

      if (!state.Auth.token) {
        return rejectWithValue("No token found");
      }

      const response = await fetch(
        "https://ajqszvxwvobaedtlpewk.supabase.co/auth/v1/user",
        {
          method: "GET",
          headers: {
            apikey: import.meta.env.VITE_API_KEY,
            Authorization: `Bearer ${state.Auth.token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          data?.msg || data?.error || "Failed to get user"
        );
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Unknown error");
    }
  }
);

/* =======================
   SLICE
======================= */

const User = createSlice({
  name: "user",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },

    logout: (state) => {
      state.token = "";
      state.user = null;
      state.error = null;
    },
  },
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
        state.error = (action.payload as string) || "Failed to get user";
      });
  },
});

export const { setToken, logout } = User.actions;
export default User.reducer;