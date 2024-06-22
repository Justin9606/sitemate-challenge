import axios from 'axios';

const ARTICLE_API_KEY = 'ddb7bd6495e7436f9bed691b844c0a4c';
const BASE_URL = 'https://newsapi.org/v2';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    apiKey: ARTICLE_API_KEY,
  },
});

export default api;
