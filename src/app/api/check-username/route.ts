import dbConnection from "@/app/lib/dbConnect";
import userModel from "@/models/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const usernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnection();
  try {
    const url = new URL(request.url);
    const queryParam = {
      username: url.searchParams.get("username"),
    };

    // validate with zod
    const result = usernameQuerySchema.safeParse(queryParam);

    console.log("Query parms results");
    console.log(result);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json({
        success: false,
        message: usernameErrors ? usernameErrors : "Inavlid query params",
        status: 400,
      });
    }

    const {username} = result.data;

    const existingUser = await userModel.findOne({username, isVerified:true});
    if(existingUser){
      return Response.json({
        success: false,
        message: "usename is already taken",
        status: 400,
      });
    }

    return Response.json({
      success: true,
      message: "usename is available",
      status: 200,
    });


  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error while checking user-name",
        status: 500,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
