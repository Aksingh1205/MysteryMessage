import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import dbConnect from "./lib/dbConnect"
import UserModel from "./model/User"
import bcrypt from 'bcryptjs';
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      id: "credentials",
      name : "Credentials",
      credentials: {
        email: { label: "Email", type:"text" },
        password: { label: "Password", type: "password" },
      },
      async authorize( credentials: any) : Promise<any> {
        await dbConnect()
        try {
          const user = await UserModel.findOne({
            $or: [
              {email : credentials.identifier.email},
              {username : credentials.identifier.username}
            ]
          })
          if(!user){
            throw new Error("No user found with this email")
          }
          if(!user.isVerified){
            throw new Error("Please verify your account")
          }
          const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
          if(isPasswordCorrect){
            return user
          } else{
            throw new Error("Incorrect Password")
          }
        } catch (err:any) {
          throw new Error(err)
        }
      },
    }),
  ],
  callbacks : {
    async jwt({ token, user}) {
      if(user){
        token._id = user._id?.toString()
        token.isVerified = user.isVerified
        token.isAcceptingMessages = user.isAcceptingMessages
        token.username = user.username
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session;
    },
  },
  pages: {
    signIn: '/signin'
  },
  session: {
    strategy: "jwt"
  },
  secret : process.env.AUTH_SECRET
})