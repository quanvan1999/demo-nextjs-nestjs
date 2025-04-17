import NextAuth, { DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

interface User {
  id: string;
  _id: string;
  username: string;
  email: string;
  emailVerified: Date | null;
  isVerify: boolean;
  type: string;
  role: string;
}

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    access_token: string;
    refresh_token: string;
    user: User;
    access_expire: number;
    error: string;
  }
}
