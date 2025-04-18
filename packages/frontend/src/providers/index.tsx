'use client';

import { setConfig } from '@/api';
import { BASE_URL } from '@/constants';
import { SessionProvider } from 'next-auth/react';
import React, { useEffect } from 'react';

type Props = {
  children: React.ReactNode;
};

const Providers = ({ children }: Props) => {
  useEffect(() => {
    setConfig({
      baseURL: `${BASE_URL}/api/v1`,
      //   onRequest: intercepRequest,
      //   onError: intercepError(instance) as any,
    });
  }, []);

  return <SessionProvider>{children}</SessionProvider>;
};

export default Providers;
