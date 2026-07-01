import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "alex@intellex.ai" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Placeholder authorize implementation
        // Database queries and bcrypt validation will go here
        if (credentials?.email && credentials?.password) {
          return { id: "1", name: "Alex Chen", email: credentials.email, role: "ENTERPRISE_MEMBER" };
        }
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "USER";
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.sub || "",
          role: (token.role as string) || "USER"
        } as any;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/auth/error"
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "development-secret-key-12345",
};
export default authOptions;
