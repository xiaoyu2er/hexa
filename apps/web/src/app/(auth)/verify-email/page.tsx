import { redirect } from "next/navigation";
import { VerifyEmail } from "./VerifyEmail";
import { validateRequest } from "@/lib/auth/validate-request";

export const metadata = {
  title: "Verify Email",
  description: "Verify Email Page",
};

export default async function VerifyEmailPage() {
  const { user } = await validateRequest();
  // If user is logged in and email is verified, redirect to Home page
  if (user && user.emailVerified) redirect("/");
  // If user is not logged in, redirect to Sign Up page
  if (!user?.email) redirect("/sign-up");

  return <VerifyEmail email={user?.email} />;
}
