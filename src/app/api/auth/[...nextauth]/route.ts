import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  callbacks: {
    async signIn({ account, profile }) {
      // You can perform initial checks here
      return true
    },
    async session({ session, token }) {
      // Add additional user details to session
      session.user = {
        ...session.user,
        id: token.sub,
        // Add any additional fields from Google profile
        googleId: token.sub,
        name: token.name,
        email: token.email,
        image: token.picture
      }
      return session
    },
    async jwt({ token, account, profile }) {
      // Capture additional details from Google profile
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