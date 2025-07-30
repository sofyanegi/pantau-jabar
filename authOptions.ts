import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleAuthProvider from 'next-auth/providers/google';
import prisma from '@/libs/prisma';
import hashPassword from '@/libs/hash';

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'your@email.com' },
        password: { label: 'Password', type: 'password', placeholder: '******' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) return null;

          const user = await prisma.user.findUnique({ where: { email: credentials.email } });
          if (!user || !user.password) return null;

          const hashed = await hashPassword(credentials.password);
          if (user.password !== hashed) return null;

          const { password, ...userWithoutPassword } = user;
          return {
            ...userWithoutPassword,
            role: user.role ? String(user.role) : 'USER',
          };
        } catch (error) {
          return null;
        }
      },
    }),
    GoogleAuthProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  session: { strategy: 'jwt', maxAge: 24 * 60 * 60 },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email ?? '' },
        });

        if (!existingUser && user.email) {
          await prisma.user.create({
            data: {
              name: user.name ?? 'No Name',
              email: user.email,
              image: user.image,
              password: await hashPassword('password'),
              role: 'USER',
            },
          });
        }
      }

      return !!user;
    },
    async jwt({ token, user }) {
      // Saat pertama kali login
      if (user?.email) {
        const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
        if (dbUser) {
          token.userId = dbUser.id;
          token.name = dbUser.name;
          token.email = dbUser.email;
          token.role = dbUser.role ?? 'USER';
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.userId;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role;
      }
      return session;
    },
  },
};
