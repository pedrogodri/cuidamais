import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { normalizeApiError } from './errors';

export function attachAuthHeader(
  config: InternalAxiosRequestConfig,
  getToken: () => string | null,
): InternalAxiosRequestConfig {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}

interface CreateApiClientOptions {
  baseURL: string;
  getToken: () => string | null;
}

export function createApiClient({ baseURL, getToken }: CreateApiClientOptions): AxiosInstance {
  const instance = axios.create({ baseURL });

  instance.interceptors.request.use((config) => attachAuthHeader(config, getToken));

  instance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(normalizeApiError(error)),
  );

  return instance;
}
