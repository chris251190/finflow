import NextAuth from 'next-auth';
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase } from '../../../lib/db';
import { verifyPassword } from '../../../lib/auth';

export const authOptions: NextAuthOptions = {
  secret: process.env.JWT_SECRET, // Use an environment variable for the JWT secret
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
        password: {  label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const { db } = await connectToDatabase();
        const user = await db.collection('users').findOne({ email: credentials?.email });

        if (!user) {
          throw new Error('No user found!');
        }

        const isValid = await verifyPassword(credentials?.password, user.password);
        if (!isValid) {
          throw new Error('Could not log you in!');
        }

        return { email: user.email, id: user._id };
      }
    })
  ]
}

export default NextAuth(authOptions);