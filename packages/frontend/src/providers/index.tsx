import { SessionProvider } from 'next-auth/react';
import React from 'react';

type Props = {
  children: React.ReactNode;
};

const Providers = ({ children }: Props) => {
  // useEffect(() => {
  //   setConfig({
  //     baseURL: BASE_URL,
  //     //   onRequest: intercepRequest,
  //     //   onError: intercepError(instance) as any,
  //   });
  // }, []);

  return <SessionProvider>{children}</SessionProvider>;
};

export default Providers;
