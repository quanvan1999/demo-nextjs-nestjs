import { BASE_URL } from '@/constants';
import { Api } from '../api/sdk';
import { auth } from '../auth';
import { getSession } from 'next-auth/react';

// Create API instance
export const createApiClient = (token?: string) => {
  const api = new Api({
    baseURL: `${BASE_URL}/api/v1`,
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  });

  return api;
};

// For client components
export const useApi = () => {
  const getApiClient = async () => {
    const session = await getSession();
    const token = session?.user?.access_token;
    return createApiClient(token);
  };

  return {
    getApiClient,
  };
};

// For server components
export const getServerApi = async () => {
  const session = await auth();
  const token = session?.user?.access_token;
  return createApiClient(token);
};
