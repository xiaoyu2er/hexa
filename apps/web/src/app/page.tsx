import { validateRequest } from "@/lib/auth/validate-request";
import { Logout } from "../components/Logout";
import { Login } from "../components/Login";
import { SignUp } from "../components/SignUp";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@hexa/ui/alert-dialog";
import { Button } from "@hexa/ui/button";

export function AlertDialogDemo() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Show Dialog</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default async function Home() {
  const { user, session } = await validateRequest();
  return (
    <div className="flex flex-col items-center justify-center h-screen px-2">
      {session ? (
        <>
          <div className="w-1/2 whitespace-pre-wrap">
            user: {JSON.stringify(user, null, "\t")}
          </div>
          <div className="w-1/2 whitespace-pre-wrap">
            session: {JSON.stringify(session, null, "\t")}
          </div>
          <Logout />
        </>
      ) : (
        <div className="flex gap-12">
          <AlertDialogDemo />
          <Login />
          <SignUp />
        </div>
      )}
    </div>
  );
}
