"use client";

import { Button } from "@hexa/ui/button";
import Link from "next/link";

export const Login = () => {
  return (
    <Button asChild>
      <Link href="/login">Login</Link>
    </Button>
  );
};
