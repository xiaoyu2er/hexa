import { validateRequest } from "@/lib/auth/validate-request";
import { NEXT_PUBLIC_APP_NAME } from "@/lib/env";
import { Button } from "@hexa/ui/button";
import { Loader2Icon } from "@hexa/ui/icons";
import Link from "next/link";
import { Suspense } from "react";
import { ModeToggle } from "./mode-toggle";

async function HeaderActions() {
  const { user } = await validateRequest();
  const isSignedIn = !!user;

  return (
    <>
      {isSignedIn ? (
        <>
          <div className="hidden md:block">
            <ModeToggle />
          </div>
          <Button asChild variant="secondary">
            <Link href="/settings">Dashboard</Link>
          </Button>
        </>
      ) : (
        <>
          <ModeToggle />
          <Button asChild variant="secondary">
            <Link href="/login">Log In</Link>
          </Button>
        </>
      )}
    </>
  );
}

export async function Header() {
  return (
    <div className="border-b py-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex gap-8 items-center">
          <Link href="/" className="flex gap-2 items-center text-xl">
            <div className="hidden md:block">{NEXT_PUBLIC_APP_NAME}</div>
          </Link>
        </div>
        <div className="flex items-center justify-between gap-5">
          <Suspense
            fallback={
              <div className="flex items-center justify-center w-40">
                <Loader2Icon className="animate-spin w-4 h-4" />
              </div>
            }
          >
            <HeaderActions />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
