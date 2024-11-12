import {resend} from  '@/lib/resend';
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from '@/types/ApiResponse';

export async function sendVerificationEmail(
    email: string,
    username : string,
    verifyCode : string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Mystery message | Verification Code',
            react: VerificationEmail({username, otp : verifyCode}),
          });
        return{success : true, message : "Verification mail sent successfully"}
    } catch (emailError) {
        console.log("Error sending verification mail", emailError);
        return{success : false, message : "Failed to send verification mail"}
    }
}