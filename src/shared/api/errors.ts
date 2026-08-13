import { AxiosError } from 'axios';

export class ApiError extends Error {
  status: number | null;
  code: string | null;

  constructor(message: string, status: number | null = null, code: string | null = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

interface ApiErrorBody {
  code?: string;
  message?: string;
}

export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    const body = error.response?.data as ApiErrorBody | undefined;
    return new ApiError(
      body?.message ?? error.message,
      error.response?.status ?? null,
      body?.code ?? null,
    );
  }

  if (error instanceof Error) {
    return new ApiError(error.message);
  }

  return new ApiError('Unknown error');
}
