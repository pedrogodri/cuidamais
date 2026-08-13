import { AxiosError } from 'axios';
import { ApiError, normalizeApiError } from './errors';

describe('normalizeApiError', () => {
  it('extracts status and code from an axios error with a response', () => {
    const axiosError = new AxiosError('Request failed', undefined, undefined, undefined, {
      status: 404,
      statusText: 'Not Found',
      headers: {},
      config: {} as never,
      data: { code: 'NOT_FOUND', message: 'Recurso não encontrado' },
    });

    const result = normalizeApiError(axiosError);

    expect(result).toBeInstanceOf(ApiError);
    expect(result.status).toBe(404);
    expect(result.code).toBe('NOT_FOUND');
    expect(result.message).toBe('Recurso não encontrado');
  });

  it('falls back to a generic error when there is no response (network failure)', () => {
    const axiosError = new AxiosError('Network Error');

    const result = normalizeApiError(axiosError);

    expect(result.status).toBeNull();
    expect(result.code).toBeNull();
    expect(result.message).toBe('Network Error');
  });

  it('wraps non-axios errors as a generic ApiError', () => {
    const result = normalizeApiError(new Error('boom'));

    expect(result).toBeInstanceOf(ApiError);
    expect(result.status).toBeNull();
    expect(result.message).toBe('boom');
  });
});
