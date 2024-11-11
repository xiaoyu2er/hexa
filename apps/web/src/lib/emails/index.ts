import { IS_DEVELOPMENT, NEXT_PUBLIC_APP_NAME } from "@/lib/env";
import { ApiError } from "@/lib/error/error";
import VerifyCodeAndUrlTemplate from "@hexa/email-templates/VerifyCodeAndUrl";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { Resend } from "resend";

export async function sendVerifyCodeAndUrlEmail(
  email: string,
  code: string,
  url: string,
) {
  if (IS_DEVELOPMENT) {
    // sleep 1000;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { code, email, url };
  }
  const { env } = await getCloudflareContext();
  const resend = new Resend(env.RESEND_API_KEY);
  // @ts-ignore text is not required
  const { data, error } = await resend.emails.send({
    from: "Hexa <noreply@hexa.im>",
    to: [email],
    subject: "Verify your code",
    react: VerifyCodeAndUrlTemplate({
      email,
      code,
      url,
      appName: NEXT_PUBLIC_APP_NAME ?? "Hexa",
    }),
  });

  if (error) {
    console.error("Failed to send email", error);
    throw new ApiError("INTERNAL_SERVER_ERROR", "Failed to send email");
  }

  return { email, ...data };
}
