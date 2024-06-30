import { validateRequest } from "@/lib/auth/validate-request";

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
import { Header } from "@/components/header/header";

function AlertDialogDemo() {
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
    <>
      <Header />
      <div className="flex flex-col items-center justify-center h-screen px-2">
        {session ? (
          <>
            <div>user: {JSON.stringify(user, null, "\t")}</div>
            <div>session: {JSON.stringify(session, null, "\t")}</div>
          </>
        ) : (
          <div className="flex gap-12">
            <AlertDialogDemo />
          </div>
        )}
      </div>
    </>
  );
}
