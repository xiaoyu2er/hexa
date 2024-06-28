import { redirect } from "next/navigation";
import { Signup } from "./SignUp";
import { validateRequest } from "@/lib/auth/validate-request";

export const metadata = {
  title: "Sign Up",
  description: "Signup Page",
};

export default async function SignupPage() {
  const { user } = await validateRequest();
  if (user?.emailVerified) {
    return redirect("/");
  }
  return <Signup email={user?.email} />;
}
