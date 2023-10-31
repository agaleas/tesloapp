import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { dbUsers } from '@/database';
import Credentials from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? '',
      clientSecret: process.env.GITHUB_SECRET ?? '',
    }),
    // ...add more providers here
    Credentials({
      name: 'Custom login',
      credentials: {
        email: {
          label: 'Correo:',
          type: 'email',
          placeholder: 'correo@google.com',
        },
        password: {
          label: 'Contraseña:',
          type: 'password',
          placeholder: 'Contraseña',
        },
      },
      async authorize(credentials) {
        return await dbUsers.checkUserEmailPassword(
          credentials!.email,
          credentials!.password
        );
      },
    }),
  ],

  //Pages
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register',
  },

  session: {
    maxAge: 2592000, //30d
    strategy: 'jwt',
    updateAge: 86400,
  },

  //callbacks
  callbacks: {
    async jwt({ token, user, account }) {
      // console.log({ token1: token, account1: account, user1: user });
      if (account) {
        token.accessToken = account.access_token || '';
        switch (account.type) {
          case 'oauth':
            token.user = await dbUsers.oAuthToDbUser(
              user?.email ?? '',
              user?.name ?? ''
            );
            break;
          case 'credentials':
            token.user = user;
            break;
        }
      }
      return token;
    },
    async session({ session, user, token }) {
      // console.log({ session2: session, user2: user, token2: token });
      session.accessToken = token.accessToken;
      session.user = token.user as any;
      return session;
    },
  },
};

export default NextAuth(authOptions);
