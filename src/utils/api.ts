const BASE_URL = 'https://ajqszvxwvobaedtlpewk.supabase.co/';

const getBaseUrl = (endpoint: string) => {
  return `${BASE_URL}${endpoint}`;
};

export default getBaseUrl;
