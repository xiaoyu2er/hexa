import VerifyCodeAndUrlTemplate from "@hexa/email-templates/VerifyCodeAndUrl";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { Resend } from "resend";
import { ZSAError } from "zsa";

export async function sendVerifyCodeAndUrlEmail(
  email: string,
  code: string,
  url: string,
) {
  const { env } = await getCloudflareContext();
  const resend = new Resend(env.RESEND_API_KEY);
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
