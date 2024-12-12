import { googleSignup } from "@/app/services/userApi";
import { googleExpertSignup } from "@/app/services/expertApi";

import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { ProfileType } from "@/types/types";

declare module "next-auth" {
  interface Session {
    isExpert?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    isExpert?: boolean;
  }
}

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ account, profile}) {
      return true;
    },
    async redirect({ url, baseUrl }) {
      if (url.includes("/expert/")) {
        return `${baseUrl}/expert/dashboard`;
      }
      return `${baseUrl}/dashboard`;
    },
    async jwt({ token, account, profile, user, }) {
      if (account?.provider === "google") {
        
        const { name, email, sub, picture } = profile as ProfileType;

        try {
          const isExpert =  false;

          let res;
          if (isExpert) {
            res = await googleExpertSignup({
              name: name || "",
              email: email || "",
              googleId: sub || "",
              image: picture,
            });
          } else {
            res = await googleSignup({
              name: name || "",
              email: email || "",
              googleId: sub || "",
              image: picture,
            });
          }

          if (res?.status) {
            return {
              ...token,
              id: sub,
              googleId: sub,
              access: res.data.token,
              userData: res.data.userData,
              isExpert,
              name,
              email,
              picture,
            };
          }
          return token;
        } catch (error) {
          console.error("Signup error:", error);
          return token;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.sub,
          googleId: token.sub,
          name: token.name,
          email: token.email,
          image: token.picture,
          access: token.access as string,
          userData: token.userData,
          isExpert: token.isExpert as boolean,
        };
      }
      
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };


