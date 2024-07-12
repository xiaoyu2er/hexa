import { SignupPage } from "./signup";

export const metadata = {
  title: "Sign Up",
  description: "Signup Page",
};

export default function () {
  return (
    <div className="max-w-full md:w-96">
      <SignupPage />
    </div>
  );
}
