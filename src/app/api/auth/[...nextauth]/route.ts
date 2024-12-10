
import { googleSignup } from "@/app/services/userApi";
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { ProfileType } from "@/types/types";


const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  callbacks: {
    async signIn({ account, profile  }) {
      return true
    },
    async redirect({ url, baseUrl }) {
      // Custom redirect logic
      if (url.startsWith(baseUrl)) {
        return `${baseUrl}/dashboard`; // Redirect to dashboard on successful login
      }
      return baseUrl; // Fallback to base URL
    },

    async jwt({ token, account, profile }) {
      if (account?.provider === 'google') {

        const {name ,email,sub,picture} = profile as ProfileType
        try {
          
          const res = await googleSignup({name,email,googleId:sub,image:picture})
          if(res.status){
            token.access = res.data.token
            token.user = res.data.userData;
          }
          return token
        } catch (error) {
          return token
        }  
      }
      return token
    },

    async session({ session, token }) {
      if (token) {
         session.user =  {
          ...token,
        }
        return session
    }
    return session
  }
  }
})

export { handler as GET, handler as POST }