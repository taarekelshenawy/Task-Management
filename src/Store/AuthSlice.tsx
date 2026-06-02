import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


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
  "sign-up/Auth",
  async (payload:signUpData, thunkAPI) => {
    console.log(payload)
    const { rejectWithValue } = thunkAPI;

    try {
      const response = await fetch(
        "https://ajqszvxwvobaedtlpewk.supabase.co/auth/v1/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
             apikey: "sb_publishable_U3Wle88gCYWWTUPzW2XL-A_2Egw6YkF"
          
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(
            errorData?.msg ||
            errorData?.error ||
            "Signup failed"
        );
      }

      const result = await response.json();

      return result; 
    } catch (error) {
    if (error instanceof Error) {
    return rejectWithValue(error.message);
  }

  return rejectWithValue("Unknown error");
    }
  }
);
const initialState = {
  loading: false,
  error: null as string | null,
  success: false,
};

const Auth =createSlice({
    name:'Authentication',
    initialState:initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(Signup.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(Signup.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })

      .addCase(Signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string|| "Something went wrong";
        state.success = false;
      });
    }
})

export default Auth.reducer;

