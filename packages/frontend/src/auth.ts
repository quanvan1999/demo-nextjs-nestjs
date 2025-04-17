import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { InvalidCredentialsError } from './utils/errors';
import { request } from './api';
import { BASE_URL } from './constants';

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

        const user = await request({
          method: 'POST',
          url: `${BASE_URL}/api/v1/auth/login`,
          data: {
            email: credentials.email,
            password: credentials.password,
          },
        });

        console.log(user.data);

        try {
          const user = null;

          if (!user) {
            throw new InvalidCredentialsError('Invalid credentials');
          }

          return user;
        } catch (e) {
          throw new InvalidCredentialsError((e as { message: string }).message);
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
});
