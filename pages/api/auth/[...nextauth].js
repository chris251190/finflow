import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import { connectToDatabase } from '../../../lib/db';
import { verifyPassword } from '../../../lib/auth';

export default NextAuth({
  session: {
    jwt: true,
  },
  providers: [
    Providers.Credentials({
      async authorize(credentials) {
        const { db } = await connectToDatabase();

        const user = await db.collection('users').findOne({ email: credentials.email });

        if (!user) {
          throw new Error('No user found!');
        }

        const isValid = await verifyPassword(credentials.password, user.password);

        if (!isValid) {
          throw new Error('Could not log you in!');
        }

        return { email: user.email };
      }
    })
  ],
  database: process.env.MONGODB_URI,
  callbacks: {
    jwt: async (token, user) => {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session: async (session, user) => {
      session.user.id = user.id;
      return session;
    },
  },
});