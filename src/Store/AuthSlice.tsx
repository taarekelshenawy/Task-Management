import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

/* =======================
   TYPES
======================= */

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

type LoginResponse = {
  access_token: string;
};

type stateProps = {
  loading: boolean;
  error: string | null;

  token: string;

  signupSuccess: boolean;
  loginSuccess: boolean;
  forgotSuccess: boolean;
  logoutSuccess: boolean;
};

/* =======================
   INITIAL STATE
======================= */

const initialState: stateProps = {
  loading: false,
  error: null,
  token: localStorage.getItem("token") || "",

  signupSuccess: false,
  loginSuccess: false,
  forgotSuccess: false,
  logoutSuccess: false,
};

/* =======================
   SIGNUP
======================= */

export const Signup = createAsyncThunk(
  "auth/signup",
  async (payload: signUpData, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const response = await fetch(
        "https://ajqszvxwvobaedtlpewk.supabase.co/auth/v1/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_API_KEY,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          data?.msg || data?.error || "Signup failed"
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
   LOGIN
======================= */

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

/* =======================
   FORGOT PASSWORD
======================= */

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (data: { email: string }, thunkAPI) => {
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

      const result = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          result?.error_description ||
            result?.error ||
            "Failed to send reset email"
        );
      }

      return result;
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

const Auth = createSlice({
  name: "Authentication",
  initialState,
  reducers: {
    logoutLocal: (state) => {
      state.token = "";
      localStorage.removeItem("token");

      state.loginSuccess = false;
      state.signupSuccess = false;
      state.forgotSuccess = false;
      state.logoutSuccess = true;
    },
  },

  extraReducers: (builder) => {
    /* ================= SIGNUP ================= */
    builder
      .addCase(Signup.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.signupSuccess = false;
      })
      .addCase(Signup.fulfilled, (state) => {
        state.loading = false;
        state.signupSuccess = true;
      })
      .addCase(Signup.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Signup failed";
      });

    /* ================= LOGIN ================= */
    builder
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.loginSuccess = false;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.loginSuccess = true;

        // ✅ FIX: correct token extraction
        state.token = action.payload.access_token;

        localStorage.setItem("token", action.payload.access_token);
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Login failed";
      });

    /* ================= FORGOT ================= */
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.forgotSuccess = false;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.forgotSuccess = true;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed";
      });
  },
});

export const { logoutLocal } = Auth.actions;
export default Auth.reducer;




// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";




// type signUpData = {
//   email: string;
//   password: string;
//   confirmPassword: string;
//   data: {
//     name: string;
//     department: string;
//   };
// };

// type loginData = {
//   email: string;
//   password: string;
 
// };

// export const Signup = createAsyncThunk(
//   "sign-up/Auth",
//   async (payload:signUpData, thunkAPI) => {
//     console.log(payload)
//     const { rejectWithValue } = thunkAPI;

//     try {
//       const response = await fetch(
//         "https://ajqszvxwvobaedtlpewk.supabase.co/auth/v1/signup",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//              apikey:import.meta.env.VITE_API_KEY
          
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         return rejectWithValue(
//             errorData?.msg ||
//             errorData?.error ||
//             "Signup failed"
//         );
//       }

//       const result = await response.json();

//       return result; 
//     } catch (error) {
//     if (error instanceof Error) {
//     return rejectWithValue(error.message);
//   }

//   return rejectWithValue("Unknown error");
//     }
//   }
// );

// // login function
// export const signIn =createAsyncThunk('login/Auth',
//   async(data:loginData,thunkAPI)=>{
//     console.log(data)
//     const{rejectWithValue}=thunkAPI;
//     try{
//       const response = await fetch("https://ajqszvxwvobaedtlpewk.supabase.co/auth/v1/token?grant_type=password",{
//          method: "POST", // Specify HTTP method
//         headers: {
//               "Content-Type": "application/json",
//               apikey:import.meta.env.VITE_API_KEY
            
//             },
//           body: JSON.stringify(data)
//           })

//       if (!response.ok) {
//         const errorData = await response.json();
//         return rejectWithValue(
//             errorData?.msg ||
//             errorData?.error ||
//             "Signup failed"
//         );
//       }
//       const info = await response.json();
//       localStorage.setItem("token",info.access_token)
//       return info;

//     }
//     catch(error){
//       if(error instanceof Error){
//         return rejectWithValue(error.message)
//       }

//     }

//   }
// )


// // forgot password

// type forgotPasswordData = {
//   email: string;
// };

// export const forgotPassword = createAsyncThunk(
//   "forgotPassword/Auth",
//   async (data: forgotPasswordData, thunkAPI) => {
//     const { rejectWithValue } = thunkAPI;
    

//     try {
//       const response = await fetch(
//         "https://ajqszvxwvobaedtlpewk.supabase.co/auth/v1/recover",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             apikey: import.meta.env.VITE_API_KEY,
//           },
//           body: JSON.stringify(data),
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.log(errorData)

//         return rejectWithValue(
//           errorData?.msg ||
//             errorData?.error_description ||
//             errorData?.error ||
//             "Failed to send reset email"
//         );
//       }

//       return await response.json();
//     } catch (error) {
//       console.log(error)
//       if (error instanceof Error) {
//         return rejectWithValue(error.message);
//       }

//       return rejectWithValue("Unknown error");
//     }
//   }
// );


// // Logout 

// export const logoutFunction = createAsyncThunk(
//   "Logout/Auth",
//   async (_, thunkAPI) => {
//     const { rejectWithValue } = thunkAPI;
//     const {getState}=thunkAPI;

    

//     try {
//          const state = getState() as { Auth: stateProps };
//       const response = await fetch(
//         "https://ajqszvxwvobaedtlpewk.supabase.co/auth/v1/logout",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             apikey: import.meta.env.VITE_API_KEY,
//             Authorization: `Bearer ${state.Auth.token}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.log(errorData)

//         return rejectWithValue(
//           errorData?.msg ||
//             errorData?.error_description ||
//             errorData?.error ||
//             "Failed to send reset email"
//         );
//       }

//       return await response.json();
//     } catch (error) {
//       console.log(error)
//       if (error instanceof Error) {
//         return rejectWithValue(error.message);
//       }

//       return rejectWithValue("Unknown error");
//     }
//   }
// );





// type stateProps={
//    loading: boolean,
//   error: null | string,
//   success: boolean,
//   token:string,

// }



// const initialState:stateProps = {
//   loading: false,
//   error: null as string | null,
//   success: false,
//   token: localStorage.getItem('token') || '',
// };

// const Auth =createSlice({
//     name:'Authentication',
//     initialState:initialState,
//     reducers:{},
//     extraReducers:(builder)=>{
//         builder.addCase(Signup.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.success = false;
//       })

//       .addCase(Signup.fulfilled, (state) => {
//         state.loading = false;
//         state.success = true;
//       })

//       .addCase(Signup.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string|| "Something went wrong";
//         state.success = false;
//       });

//       /// login 
//        builder.addCase(signIn.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.success = false;
//       })

//       .addCase(signIn.fulfilled, (state,action) => {
//         state.loading = false;
//         state.token=action.payload as string;
//         state.success = true;
//       })

//       .addCase(signIn.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string|| "Something went wrong";
//         state.success = false;
//       });

//       // forgot 
//       builder
//   .addCase(forgotPassword.pending, (state) => {
//     state.loading = true;
//     state.error = null;
//   })
//   .addCase(forgotPassword.fulfilled, (state) => {
//     state.loading = false;
//     state.success = true;
//   })
//   .addCase(forgotPassword.rejected, (state, action) => {
//     state.loading = false;
//     state.error = action.payload as string;
//   });

//   /// logout

//       builder
//   .addCase(logoutFunction.pending, (state) => {
//     state.loading = true;
//     state.error = null;
//   })
//   .addCase(logoutFunction.fulfilled, (state) => {
//     state.loading = false;
//     state.success = true;
//     localStorage.removeItem('token')
//     state.token='';
//   })
//   .addCase(logoutFunction.rejected, (state, action) => {
//     state.loading = false;
//     state.error = action.payload as string;
//   });
//     }
// })

// export default Auth.reducer;

