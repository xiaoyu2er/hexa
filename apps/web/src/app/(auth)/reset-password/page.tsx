import { redirect } from "next/navigation";
import { ResetPassword } from "./ResetPassword";
import { validateRequest } from "@/lib/auth/validate-request";

export const metadata = {
  title: "Verify Email",
  description: "Verify Email Page",
};

export default async function ResetPasswordPage() {
  // const { user } = await validateRequest();
  // // If user is logged in and email is verified, redirect to Home page
  // if (user && user.emailVerified) redirect("/");
  // // If user is not logged in, redirect to Sign Up page
  // if (!user?.email) redirect("/sign-up");

  return <ResetPassword />;
  // return <div>Verify Email Page</div>;
}
