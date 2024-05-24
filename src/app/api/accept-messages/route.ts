import dbConnection from "@/app/lib/dbConnect";
import userModel from "@/models/User";

import { getServerSession } from "next-auth";

import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";

export async function POST(request: Request) {
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

  const userID = user._id;
  const { acceptMessages } = await request.json();
  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      userID,
      {
        isAcceptingMessage: acceptMessages,
      },
      {
        new: true,
      }
    );

    if (!updatedUser) {
      return Response.json({
        success: false,
        message: "Failed to update user status",
        status: 401,
      });
    }

    return Response.json({
      success: true,
      message: "User update Message status successful",
      status: 200,
      updatedUser,
    });
  } catch (error) {
    return Response.json({
      success: false,
      message: "Failed to update user status",
      status: 401,
    });
  }
}

export async function GET(request: Request) {
  await dbConnection();

  const session = await getServerSession(authOptions);
  const user: User = session?.user;
  try {
    if (!session || session.user) {
      return Response.json({
        success: false,
        message: "Unauthorized",
        status: 401,
      });
    }

    const userID = user.id;
    const foundUser = await userModel.findById(userID);

    if (!foundUser) {
      return Response.json({
        success: false,
        message: "No user found",
        status: 401,
      });
    }

    return Response.json({
      success: true,
      isAcceptingMessage: foundUser.isAcceptingMessage,
      message: "User found successfully",
      status: 200,
    });
  } catch (error) {
    return Response.json({
      success: false,
      message: "No User found",
      status: 401,
    });
  }
}
