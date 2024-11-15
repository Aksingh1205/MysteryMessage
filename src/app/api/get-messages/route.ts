import { auth } from "@/auth"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User"
import mongoose from "mongoose"
import { User } from "next-auth"

export async function GET(request : Request){
    await dbConnect()

    const session = await auth()
    const user : User = session?.user

    if(!session || !session.user){
        return Response.json({
            success : false,
            message : "Not Authenticated"
        }, {status : 401})
    }

    const userID = new mongoose.Types.ObjectId(user._id)
    try {
        const user = await UserModel.aggregate([
            {$match: {id: userID}},
            {$unwind: '$messages'},
            {$sort: {'messages.createdAt': -1}},
            {$group: {_id: '$_id', messages: {$push: '$messages'}}}
        ])
        if(!user || user.length === 0){
            return Response.json({
                success : false,
                message : "User not found"
            }, {status : 401})
        }

        return Response.json({
            success : true,
            messages : user[0].messages
        }, {status : 200})
    } catch (error) {
        return Response.json({
            success : false,
            message : "Error in fetching messages",
            error
        }, {status : 500})
    }
}