import { Suspense } from "react";
import { ResetPassword } from "./reset-password";

export const metadata = {
  title: "Verify Email",
  description: "Verify Email Page",
};

export default function () {
  return (
    <Suspense>
      <ResetPassword />
    </Suspense>
  );
}
