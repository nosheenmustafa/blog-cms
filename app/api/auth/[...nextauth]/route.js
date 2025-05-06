import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    // Credentials provider can be used for custom logins
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = { id: "1", name: "Testuser", email: "testuser@gmail.com" };
        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
   async jwt({ token, user, account }) {
  if (account) {
    token.accessToken = account.access_token; // fix capitalization
  }
  if (user) {
    token.id = user.id;
    token.email = user.email;
  }
  return token;
},
    async session({ session, token }) {
  session.user.id = token.id;
  session.user.email = token.email;
  session.accessToken = token.accessToken; // fix capitalization
  return session;
},
  },
};


const handler = NextAuth(authOptions);
export {handler as GET, handler as POST}