import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth/validate-request";
import { Login } from "./Login";

export const metadata = {
  title: "Login",
  description: "Login Page",
};

export default async function LoginPage() {
  const { user } = await validateRequest();

  if (user?.emailVerified) redirect('/');

  return <Login />;
}
