import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import type { NextAuthOptions } from "next-auth";
import { Role } from "@prisma/client";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize() {
        const user = { id: "1", name: "J Smith", email: "jsmith@example.com", role: "STUDENT" }
        if (user) {
          return user
        } else {
          return null
          name: "Credentials",
            credentials: {
            email: { label: "Email", type: "text", placeholder: "you@example.com" },
      password: { label: "Password", type: "password" }
    },
      async authorize(credentials) {
        if(!credentials?.email || !credentials?.password) {
      return null;
    }

        try {
    const user = await prisma.user.findUnique({
      where: {
        email: credentials.email
      }
    });

    if(!user || !user.password) {
      return null;
          }

const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
if (!isPasswordValid) {
  return null;
}

return {
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role
};
        } catch (error: unknown) {
  console.error("Authentication error:", error);
  return null;
}
      }
    })
  ],
callbacks: {
    async session({ session, token }) {
    if (session.user && token) {
      // use Object.assign to avoid 'any'
      Object.assign(session.user, { id: token.id, role: token.role })
    }
    return session;
  },
    async jwt({ token, user }) {
    if (user) {
      token.id = user.id;
      token.role = (user as { role?: string }).role;
    }
    return token;
  }
}
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
    async jwt({ token, user }) {
  if (user) {
    token.role = user.role;
  }
  return token;
},
    async session({ session, token }) {
  if (session.user) {
    session.user.role = token.role as Role;
  }
  return session;
}
  },
session: {
  strategy: "jwt"
}
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
