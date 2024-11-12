import { auth } from "@/auth"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User"
import { User } from "next-auth"


export async function POST(request : Request){
    await dbConnect()

    const session = await auth()
    const user : User = session?.user

    if(!session || !session.user){
        return Response.json({
            success : false,
            message : "Not Authenticated"
        }, {status : 401})
    }

    const userID = user._id


}
