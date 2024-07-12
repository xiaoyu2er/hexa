import { Resend } from "resend";
import VerifyCodeAndUrlTemplate from "@hexa/email-templates/emails/VerifyCodeAndUrl";
import { ZSAError } from "zsa";

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerifyCodeAndUrlEmail(
  email: string,
  code: string,
  url: string,
) {
  if (process.env.NODE_ENV === "development") {
    // sleep 1000;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { code, email, url };
  }

  // @ts-ignore text is not required
  const { data, error } = await resend.emails.send({
    from: "Hexa <noreply@hexa.im>",
    to: [email],
    subject: "Verify your code",
    react: VerifyCodeAndUrlTemplate({ email, code, url }),
  });

  if (error) {
    console.error("Failed to send email", error);
    throw new ZSAError("INTERNAL_SERVER_ERROR", "Failed to send email");
  }

  return { email, ...data };
}
