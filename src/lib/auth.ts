import type { NextAuthOptions } from 'next-auth';

import { PrismaAdapter } from '@auth/prisma-adapter';

import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import LinkedInProvider from 'next-auth/providers/linkedin';

import bcrypt from 'bcryptjs';

import { prisma } from './prisma';

import { Role } from '@prisma/client';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;

      name?: string | null;

      email?: string | null;

      image?: string | null;

      role: Role;

      onboardingDone?: boolean;

      workspaceName?: string | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;

    role: Role;

    onboardingDone?: boolean;

    workspaceName?: string | null;
  }
}

const isProduction = process.env.NODE_ENV === 'production';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,

  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 30,
  },

  secret: process.env.NEXTAUTH_SECRET,

  debug: !isProduction,

  pages: {
    signIn: '/login',
    error: '/login',
  },

  providers: [
    CredentialsProvider({
      name: 'credentials',

      credentials: {
        email: {
          label: 'Email',
          type: 'email',
        },

        password: {
          label: 'Password',
          type: 'password',
        },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing email or password');
        }

        const normalizedEmail = credentials.email.toLowerCase().trim();

        const user = await prisma.user.findUnique({
          where: {
            email: normalizedEmail,
          },
        });

        if (!user || !user.password) {
          throw new Error('Invalid credentials');
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValidPassword) {
          throw new Error('Invalid credentials');
        }

        await prisma.user.update({
          where: {
            id: user.id,
          },

          data: {
            lastLoginAt: new Date(),
          },
        });

        return {
          id: user.id,

          name: user.name,

          email: user.email,

          image: user.image,

          role: user.role,

          onboardingDone: user.onboardingDone,

          workspaceName: user.workspaceName,
        };
      },
    }),

    ...(process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,

            clientSecret: process.env.GOOGLE_CLIENT_SECRET,

            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),

    ...(process.env.LINKEDIN_CLIENT_ID &&
    process.env.LINKEDIN_CLIENT_SECRET
      ? [
          LinkedInProvider({
            clientId: process.env.LINKEDIN_CLIENT_ID,

            clientSecret: process.env.LINKEDIN_CLIENT_SECRET,

            authorization: {
              params: {
                scope: 'openid profile email',
              },
            },

            issuer: 'https://www.linkedin.com',

            jwks_endpoint:
              'https://www.linkedin.com/oauth/openid/jwks',

            profile(profile) {
              return {
                id: profile.sub,

                name: profile.name,

                email: profile.email,

                image: profile.picture,
              } as any;
            },
          }),
        ]
      : []),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;

        token.role = (user as any).role ?? 'USER';

        token.onboardingDone =
          (user as any).onboardingDone ?? false;

        token.workspaceName =
          (user as any).workspaceName ?? 'Hanexis Workspace';
      }

      if (token.email) {
        const dbUser = await prisma.user.findUnique({
          where: {
            email: token.email,
          },

          select: {
            id: true,

            role: true,

            onboardingDone: true,

            workspaceName: true,
          },
        });

        if (dbUser) {
          token.id = dbUser.id;

          token.role = dbUser.role;

          token.onboardingDone =
            dbUser.onboardingDone;

          token.workspaceName =
            dbUser.workspaceName;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;

        session.user.role = token.role;

        session.user.onboardingDone =
          token.onboardingDone;

        session.user.workspaceName =
          token.workspaceName;
      }

      return session;
    },

    async signIn({ user }) {
      if (!user.email) {
        return false;
      }

      const normalizedEmail =
        user.email.toLowerCase();

      const isAdmin =
        normalizedEmail ===
        process.env.ADMIN_EMAIL?.toLowerCase();

      await prisma.user.upsert({
        where: {
          email: normalizedEmail,
        },

        update: {
          lastLoginAt: new Date(),

          role: isAdmin ? 'ADMIN' : undefined,
        },

        create: {
          email: normalizedEmail,

          name: user.name,

          image: user.image,

          role: isAdmin ? 'ADMIN' : 'USER',

          onboardingDone: false,
        },
      });

      return true;
    },
  },
};