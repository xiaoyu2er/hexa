"use client";

import { Button } from "@hexa/ui";
import Link from "next/link";

export const Login = () => {
  return (
    <Button className="mt-4" asChild>
      <Link href="/login">Login</Link>
    </Button>
  );
};