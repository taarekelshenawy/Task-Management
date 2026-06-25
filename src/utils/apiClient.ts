import Cookies from 'js-cookie';
import { refreshToken } from '../services/authService';
import { isTokenExpired } from './cookies';

export const apiClient = async (url: string, options: RequestInit = {}) => {
  if (isTokenExpired()) {
    await refreshToken();
  }

  let accessToken = Cookies.get('access_token');
  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      apikey: import.meta.env.VITE_API_KEY,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 401) {
    await refreshToken();

    accessToken = Cookies.get('access_token');

    response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  return response;
};
