import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { InvalidCredentialsError } from './utils/errors';
import { request } from './api';
import { BASE_URL } from './constants';
import { User } from './types/next-auth';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async credentials => {
        if (!credentials.email || !credentials.password) {
          return null;
        }

        const user = await request<User>({
          method: 'POST',
          url: `${BASE_URL}/api/v1/auth/login`,
          data: {
            email: credentials.email,
            password: credentials.password,
          },
        });

        if (user.status === 401) {
          throw new InvalidCredentialsError('Invalid email or password');
        } else if (user.status === 400) {
          throw new InvalidCredentialsError('Account not verified');
        } else if (user.status === 500 || !user.data) {
          throw new InvalidCredentialsError('Internal server error');
        }

        return {
          ...user.data,
        };
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.user = user as User;
      }

      return token;
    },
    session({ session, token }) {
      (session.user as User) = (token.user as any)?.data as User;

      return session;
    },
    authorized: async ({ auth }) => {
      return !!auth;
    },
  },
});
