import { PAGINATION_PER_PAGE } from '@/constants/app';

const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

console.log('api key', API_KEY);

const API_URL = 'https://pixabay.com/api/';

const DEFAULT_PARAMS = {
  key: API_KEY,
  lang: 'en',
  editors_choice: true,
  safe_search: true,
  per_page: PAGINATION_PER_PAGE,
};

const urlWithParams = (params) => {
  const mergedParams = { ...DEFAULT_PARAMS, ...params };
  if (mergedParams.q) mergedParams.q = encodeURIComponent(mergedParams.q);
  if (mergedParams.colors) {
    mergedParams.colors = mergedParams.colors.join(',');
  }
  const queryString = Object.keys(mergedParams)
    .map((key) => `${key}=${mergedParams[key]}`)
    .join('&');
  return `${API_URL}?${queryString}`;
};

export const fetchImages = async (params) => {
  try {
    const res = await fetch(urlWithParams(params));
    const data = await res.json();
    return data.hits;
  } catch (error) {
    console.log('fetch error', error);
    return [];
  }
};
