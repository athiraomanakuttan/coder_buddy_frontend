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
      const {name,email,picture,sub} = profile as ProfileType

      try {
        const response = await googleSignup({
          name, 
          email,
          image: picture,
          googleId: sub
        })
        if(response.status){
          // console.log("==============================",response.data.userData)
          // localStorage.setItem('user', JSON.stringify(response.data.userData));
          // localStorage.setItem('userAccessToken', response.data.token);
          return true
        }
      } catch (error) {
        
        return false
      }
      return false
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.sub,
          googleId: token.sub,
          name: token.name,
          email: token.email,
          image: token.picture
        }

       
      }

      return session
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
        token.sub = profile?.sub
        token.name = profile?.name
        token.email = profile?.email
        token.picture = profile?.picture  
      }
      return token
    }
  }
})

export { handler as GET, handler as POST }