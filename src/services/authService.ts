import Cookies from 'js-cookie';
import getBaseUrl from '../utils/api';

type loginData = {
  email: string;
  password: string;
};

type LoginResponse = {
  access_token: string;
  refresh_token: string;
  expires_at: number;
};

export const loginFunction = async (data: loginData): Promise<LoginResponse> => {
  try {
    const response = await fetch(
      getBaseUrl('auth/v1/token?grant_type=password'),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify(data),
      },
    );

    const result: LoginResponse = await response.json();

    if (!response.ok) {
      throw new Error((result as any)?.msg || 'Login failed');
    }

    // 🟢 save cookies
    Cookies.set('access_token', result.access_token, {
      expires: new Date(result.expires_at * 1000),
    });

    Cookies.set('refresh_token', result.refresh_token, {
      expires: 7,
    });

    Cookies.set('expires_at', result.expires_at.toString());

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error')
  }
};

type RefreshResponse = {
  access_token: string;
  refresh_token?: string;
  expires_at: number;
};

export const refreshToken = async (): Promise<RefreshResponse> => {
  try {
    const refreshToken = Cookies.get('refresh_token');

    if (!refreshToken) {
      logoutFunction();
      throw new Error('No refresh token found');
    }

    const response = await fetch(
      getBaseUrl('auth/v1/token?grant_type=refresh_token'),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
        }),
      },
    );

    const result: RefreshResponse = await response.json();

    if (!response.ok) {
      logoutFunction();
      throw new Error('Refresh failed');
    }

    // 🟢 update tokens
    Cookies.set('access_token', result.access_token, {
      expires: new Date(result.expires_at * 1000),
    });

    Cookies.set('expires_at', result.expires_at.toString());

    return result;
  } catch (err) {
    logoutFunction();

    if (err instanceof Error) {
      throw err;
    }

    throw new Error('Unknown error');
  }
};
 

export const logoutFunction = () => {
  Cookies.remove('access_token');
  Cookies.remove('refresh_token');
  Cookies.remove('expires_at');

  window.location.href = '/login';
};


type signUpData = {
  email: string;
  password: string;
  confirmPassword: string;
  data: {
    name: string;
    department: string;
  };
};

type SignUpResponse = {
access_token: string;
  refresh_token: string;
  expires_at: number;
//   user?: any;
//   session?: any;
  
};

export const registerFunction = async (
  payload: signUpData,
): Promise<SignUpResponse> => {
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

    const data: SignUpResponse = await response.json();

    if (!response.ok) {
      throw new Error(
        (data as any)?.msg || (data as any)?.error || 'Signup failed',
      );
    }

    // 🟢 save cookies
    Cookies.set('access_token', data.access_token, {
      expires: new Date(data.expires_at * 1000),
    });

    Cookies.set('refresh_token', data.refresh_token, {
      expires: 7,
    });

    if (data.expires_at) {
      Cookies.set('expires_at', data.expires_at.toString());
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Unknown error');
  }
};