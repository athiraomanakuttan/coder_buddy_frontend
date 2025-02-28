import { googleSignup } from "@/app/services/user/userApi";
import { googleExpertSignup } from "@/app/services/expert/expertApi";
import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { GoogleSignupResponse, ProfileType } from "@/types/types";


export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      id: 'google'
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      id: 'google-expert'
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn(): Promise<boolean> {
      return true;
    },
    async redirect({ url, baseUrl }) {
      if (url.includes("/expert/")) {
        return `${baseUrl}/expert/dashboard`;
      }
      return `${baseUrl}/dashboard`;
    },
    async jwt({ token, account, profile }) {
      if (account?.provider) {
        const { name, email, sub, picture } = profile as ProfileType;
        
        try {
          let res: GoogleSignupResponse | undefined;
          const isExpert = account.provider === 'google-expert';
          
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
          console.log("3248",res)

          if (res?.status) {
            return {
              ...token,
              id: sub,
              googleId: sub,
              access: res.data.token,
              userData: { ...res.data.userData, id: res.data.userData._id },
              isExpert,
              name,
              email,
              picture,
            };
          }
          return token;
        } catch (error: unknown) {
          console.error("Signup error:", error);
          return token;
        }
      }
      return token;
    },

    async session({ session, token }) {
      return {
        ...session,
        user: {
          id: token.sub,
          googleId: token.sub,
          name: token.name,
          email: token.email,
          image: token.picture,
          access: token.access,
          userData: token.userData,
          isExpert: token.isExpert,
        },
      };
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };