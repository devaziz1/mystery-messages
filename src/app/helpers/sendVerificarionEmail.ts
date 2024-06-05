import { resend } from "../lib/resend";
import VerificationEmail from "../../../emails/VerificationEmail";
import { API_Response } from "@/types/API_Response";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<API_Response> {
  try {
    await resend.emails.send({
      from: "aziznaseer563@gmail.com",
      to: email,
      subject: "Mystery Message Verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    return { success: true, message: "Verification email sent successfully." };
  } catch (emailError) {
    console.error("Error sending verification email:", emailError);
    return { success: false, message: "Failed to send verification email." };
  }
}
