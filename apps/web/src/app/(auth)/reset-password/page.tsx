import { Suspense } from "react";
import { ResetPasswordPage } from "./reset-password-page";

export const metadata = {
  title: "Verify Email",
  description: "Verify Email Page",
};

export default function () {
  return (
    <Suspense>
      <ResetPasswordPage />
    </Suspense>
  );
}
