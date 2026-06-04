import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { json } from "zod";



type signUpData = {
  email: string;
  password: string;
  confirmPassword: string;
  data: {
    name: string;
    department: string;
  };
};

type loginData = {
  email: string;
  password: string;
 
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
             apikey:import.meta.env.VITE_API_KEY
          
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

// login function
export const signIn =createAsyncThunk('login/Auth',
  async(data:loginData,thunkAPI)=>{
    console.log(data)
    const{rejectWithValue}=thunkAPI;
    try{
      const response = await fetch("https://ajqszvxwvobaedtlpewk.supabase.co/auth/v1/token?grant_type=password",{
         method: "POST", // Specify HTTP method
        headers: {
              "Content-Type": "application/json",
              apikey:import.meta.env.VITE_API_KEY
            
            },
          body: JSON.stringify(data)
          })

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(
            errorData?.msg ||
            errorData?.error ||
            "Signup failed"
        );
      }
      const info = await response.json();
      localStorage.setItem("token",info.access_token)
      return info;

    }
    catch(error){
      if(error instanceof Error){
        return rejectWithValue(error.message)
      }

    }

  }
)


// forgot password

type forgotPasswordData = {
  email: string;
};

export const forgotPassword = createAsyncThunk(
  "forgotPassword/Auth",
  async (data: forgotPasswordData, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    

    try {
      const response = await fetch(
        "https://ajqszvxwvobaedtlpewk.supabase.co/auth/v1/recover",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_API_KEY,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData)

        return rejectWithValue(
          errorData?.msg ||
            errorData?.error_description ||
            errorData?.error ||
            "Failed to send reset email"
        );
      }

      return await response.json();
    } catch (error) {
      console.log(error)
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }

      return rejectWithValue("Unknown error");
    }
  }
);





type stateProps={
   loading: boolean,
  error: null | string,
  success: boolean,
  token:string,

}



const initialState:stateProps = {
  loading: false,
  error: null as string | null,
  success: false,
  token: localStorage.getItem('token') || '',
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

      /// login 
       builder.addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(signIn.fulfilled, (state,action) => {
        state.loading = false;
        state.token=action.payload as string;
        state.success = true;
      })

      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string|| "Something went wrong";
        state.success = false;
      });

      // forgot 
      builder
  .addCase(forgotPassword.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(forgotPassword.fulfilled, (state) => {
    state.loading = false;
    state.success = true;
  })
  .addCase(forgotPassword.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload as string;
  });
    }
})

export default Auth.reducer;

