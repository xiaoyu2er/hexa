import { redirect } from "next/navigation";
import { SignupPage } from "./signup";
import { validateRequest } from "@/lib/auth/validate-request";

export const metadata = {
  title: "Sign Up",
  description: "Signup Page",
};

export default async function () {
  const { user } = await validateRequest();
  if (user) {
    return redirect("/");
  }
  return <SignupPage />;
}
