import type { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';

declare const AXIOS_BASE: string;
declare const AXIOS_HEADERS: string;

type AxiosHeaders = AxiosRequestConfig['headers'];

/**
 * Subset of AxiosRequestConfig
 */
export type RequestConfig<TData = unknown> = {
  baseURL?: string;
  url?: string;
  method: 'GET' | 'PUT' | 'PATCH' | 'POST' | 'DELETE' | 'OPTIONS';
  params?: unknown;
  data?: TData | FormData;
  responseType?: 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream';
  signal?: AbortSignal;
  headers?: AxiosHeaders;
  onRequest?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>;
  onResponse?: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>;
  onError?: (error: AxiosError) => AxiosError | Promise<AxiosError>;
};

/**
 * Subset of AxiosResponse
 */
export type ResponseConfig<TData = unknown> = {
  data: TData;
  status: number;
  statusText: string;
  headers?: AxiosResponse['headers'];
};

let _config: Partial<RequestConfig> = {
  baseURL: typeof AXIOS_BASE !== 'undefined' ? AXIOS_BASE : undefined,
  headers: typeof AXIOS_HEADERS !== 'undefined' ? (JSON.parse(AXIOS_HEADERS) as AxiosHeaders) : undefined,
};

export const getConfig = () => _config;

export const setConfig = (config: Partial<RequestConfig>) => {
  _config = config;

  return getConfig();
};

export const instance = axios.create(getConfig());

instance.interceptors.request.use(async config => {
  const globalConfig = getConfig();

  if (globalConfig.onRequest) {
    return globalConfig.onRequest(config);
  }

  return config;
});

instance.interceptors.response.use(
  async response => {
    const globalConfig = getConfig();

    if (globalConfig.onResponse) {
      return globalConfig.onResponse(response);
    }

    return response;
  },
  error => {
    const globalConfig = getConfig();

    if (globalConfig.onError) {
      return globalConfig.onError(error);
    }

    return error;
  },
);

export const request = async <TData, TError = unknown, TVariables = unknown>(
  config: RequestConfig<TVariables>,
): Promise<ResponseConfig<TData>> => {
  const globalConfig = getConfig();

  return instance
    .request<TData, ResponseConfig<TData>>({
      ...globalConfig,
      ...config,
      headers: {
        ...globalConfig.headers,
        ...config.headers,
      },
    })
    .catch((e: AxiosError<TError>) => {
      throw e;
    });
};

export default request;
