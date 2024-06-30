"use client";

import { Button } from "@hexa/ui/button";
import Link from "next/link";

export const SignUp = () => {
  return (
    <Button asChild variant="secondary">
      <Link href="/sign-up">Sign Up</Link>
    </Button>
  );
};
