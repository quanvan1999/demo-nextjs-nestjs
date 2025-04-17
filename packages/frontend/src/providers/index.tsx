import { setConfig } from '@/api/client';
import { BASE_URL } from '@/constants';
import React, { useEffect } from 'react';

type Props = {
  children: React.ReactNode;
};

const Providers = ({ children }: Props) => {
  useEffect(() => {
    setConfig({
      baseURL: BASE_URL,
      //   onRequest: intercepRequest,
      //   onError: intercepError(instance) as any,
    });
  }, []);

  return children;
};

export default Providers;
