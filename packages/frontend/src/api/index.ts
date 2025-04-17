import { BASE_URL } from '@/constants';
import { Api } from './sdk';

export * from './client';
export * from './sdk';

export const client = new Api({
  format: 'json',
  baseURL: BASE_URL,
});
