import dbConnection from "@/app/lib/dbConnect";
import userModel from "@/models/User";

import { getServerSession } from "next-auth";

import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnection();
  const session = await getServerSession(authOptions);
  const user: User = session?.user;

  if (!session || session.user) {
    return Response.json({
      success: false,
      message: "Unauthorized",
      status: 401,
    });
  }

  const userID = new mongoose.Types.ObjectId(user._id);
  try {
    const user = await userModel.aggregate([
      { $match: { id: userID } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!user || user.length === 0) {
      return Response.json({
        success: false,
        message: "User not found",
        status: 401,
      });
    }

    return Response.json({
      success: true,
      message: user[0].message,
      status: 200,
    });



  } catch (error) {
    return Response.json({
      success: false,
      message: "Error",
      status: 401,
    });
  }
}
