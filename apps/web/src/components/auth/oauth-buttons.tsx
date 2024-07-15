import { Button } from "@hexa/ui/button";
import { GithubIcon, GoogleIcon } from "@hexa/ui/icons";
import Link from "next/link";

export function OAuthButtons() {
  return (
    <div className="flex space-x-2">
      <Button variant="outline" className="w-full" asChild>
        <Link href="/oauth/github">
          <GithubIcon className="mr-2 h-5 w-5" />
        </Link>
      </Button>
      <Button variant="outline" className="w-full" asChild>
        <Link href="/oauth/google">
          <GoogleIcon className="mr-2 h-5 w-5" />
        </Link>
      </Button>
    </div>
  );
}
