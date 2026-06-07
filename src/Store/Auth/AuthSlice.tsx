import { createSlice } from '@reduxjs/toolkit';
import { signIn } from './act/Signin';
import { Signup } from './act/Signup';
import { forgotPassword } from './act/Forgotpassword';
import { resetPassword } from './act/Resetpassword';

type stateProps = {
  loading: boolean;
  error: string | null;
  token: string;
  signupSuccess: boolean;
  loginSuccess: boolean;
  forgotSuccess: boolean;
  logoutSuccess: boolean;
};

const initialState: stateProps = {
  loading: false,
  error: null,
  token: localStorage.getItem('token') || '',
  signupSuccess: false,
  loginSuccess: false,
  forgotSuccess: false,
  logoutSuccess: false,
};

const Auth = createSlice({
  name: 'Authentication',
  initialState,
  reducers: {
    logoutLocal: (state) => {
      state.token = '';
      localStorage.removeItem('token');

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
        state.error = (action.payload as string) || 'Signup failed';
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

        localStorage.setItem('token', action.payload.access_token);
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Login failed';
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
        state.error = (action.payload as string) || 'Failed';
      });

    /* ================= Reset ================= */
    builder
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed';
      });
  },
});

export const { logoutLocal } = Auth.actions;
export default Auth.reducer;
