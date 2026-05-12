import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

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
