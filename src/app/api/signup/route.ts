import dbConnection from "@/app/lib/dbConnect";
import userModel from "@/models/User";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/app/helpers/sendVerificarionEmail";

export async function POST(request: Request) {
  await dbConnection();

  try {

    const { username, email, password } = await request.json();
    const existingUserVerifiedByUsername = await userModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username already taken",
        },
        { status: 400 }
      );
    }

    const existingUserByEmail = await userModel.findOne({
      email,
    });

    let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
        if(existingUserByEmail.isVerified){
            return Response.json(
              {
                success: false,
                message: "Email already exists",
              },
              { status: 400 }
            );
        }else{
            const hashedPassword = await bcrypt.hash(password,10);
            existingUserByEmail.password = hashedPassword;
            existingUserByEmail.verifyCode = verifyCode;
            existingUserByEmail.verifyCodeDate = new Date(Date.now() + 3600000);

            await existingUserByEmail.save();
        }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new userModel({
        username,
        email,
        password: hashedPassword,
        verifyCode: verifyCode,
        verifyCodeDate: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();
    }

    // send VERIFICATION Email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "User Register Successully, Please verify your email",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error while user registeration", error);
    return Response.json({
      success: false,
      message: "Error while user registeration",
    });
  }
}
