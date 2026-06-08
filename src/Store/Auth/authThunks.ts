// import { createAsyncThunk } from '@reduxjs/toolkit';
// import getBaseUrl from '../../utils/api';
// import Cookies from "js-cookie";
// import { logout } from '../../services/authService';

// type loginData = {
//   email: string;
//   password: string;
// };
// type LoginResponse = {
//   access_token: string;
// };

// export const loginThunk = createAsyncThunk(
//   'auth/login',
//   async (data: loginData, thunkAPI) => {
//     const { rejectWithValue } = thunkAPI;

//     try {
//       const response = await fetch(
//         getBaseUrl('auth/v1/token?grant_type=password'),
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             apikey: import.meta.env.VITE_API_KEY,
//           },
//           body: JSON.stringify(data),
//         },
//       );

//       const result = await response.json();

//       if (!response.ok) {
//         return rejectWithValue(result?.msg || result?.error || 'Login failed');
//       }
//   // 🟢 خزّن التوكنز في cookies
//       Cookies.set('access_token', result.access_token, {
//         expires: 1 / 24, // 1 ساعة
//       });

//       Cookies.set('refresh_token', result.refresh_token, {
//         expires: 30, // 7 أيام
//       });
//       Cookies.set('expires_at', result.expires_at.toString());

//       return result as LoginResponse;
//     } catch (error) {
//       if (error instanceof Error) {
//         return rejectWithValue(error.message);
//       }
//       return rejectWithValue('Unknown error');
//     }
//   },
// );

// // refresh 
// export const refreshTokenThunk = createAsyncThunk(
//   'auth/refresh',
//   async (_, thunkAPI) => {
//     try {
//       const refreshToken = Cookies.get('refresh_token');

//       const response = await fetch(
//         getBaseUrl('auth/v1/token?grant_type=refresh_token'),
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             apikey: import.meta.env.VITE_API_KEY,
//           },
//           body: JSON.stringify({
//             refresh_token: refreshToken,
//           }),
//         },
//       );

//       const result = await response.json();

//       if (!response.ok) {
//           logout();
//         return thunkAPI.rejectWithValue('Refresh failed');
//       }

//       // update tokens
//       Cookies.set('access_token', result.access_token);

//       Cookies.set('expires_at', result.expires_at.toString());

//       return result;
//     } catch (err) {
//       return thunkAPI.rejectWithValue('Unknown error');
//     }
//   }
// );