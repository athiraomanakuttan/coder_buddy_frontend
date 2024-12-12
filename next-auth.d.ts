import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  interface Profile {
    picture?: string
    sub?: string
    name?: string
    email?: string
    isExpert?:boolean
  }

  interface Session {
    user: {
      id?: string
      name?: string
      email?: string
      image?: string
      googleId?: string
      access?:string
      userData?:any
      isExpert?: boolean;
      googleId?: string;
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    sub?: string
    name?: string
    email?: string
    picture?: string
    googleId?: string
  }
}