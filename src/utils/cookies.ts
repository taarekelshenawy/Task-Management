import Cookies from 'js-cookie';

export const getAccessToken = () => {
  return Cookies.get('access_token');
};

export const isTokenExpired = () => {
  const expiresAt = Cookies.get('expires_at');

  if (!expiresAt) return true;

  console.log(expiresAt);

  return Date.now() / 1000 > Number(expiresAt);
};
