import type { InternalAxiosRequestConfig } from 'axios';
import { attachAuthHeader, createApiClient } from './client';

describe('attachAuthHeader', () => {
  it('adds an Authorization header when a token is available', () => {
    const config = { headers: {} } as InternalAxiosRequestConfig;

    const result = attachAuthHeader(config, () => 'abc123');

    expect(result.headers.Authorization).toBe('Bearer abc123');
  });

  it('leaves headers untouched when there is no token', () => {
    const config = { headers: {} } as InternalAxiosRequestConfig;

    const result = attachAuthHeader(config, () => null);

    expect(result.headers.Authorization).toBeUndefined();
  });
});

describe('createApiClient', () => {
  it('creates an axios instance with the given base URL', () => {
    const client = createApiClient({ baseURL: 'https://api.example.com', getToken: () => null });

    expect(client.defaults.baseURL).toBe('https://api.example.com');
  });
});
