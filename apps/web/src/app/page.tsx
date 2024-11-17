import { validateRequest } from '@/lib/auth/validate-request';

import { Header } from '@/components/header/header';
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
} from '@hexa/ui/alert-dialog';
import { Button } from '@hexa/ui/button';
import { redirect } from 'next/navigation';

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
  const { session, user } = await validateRequest();
  if (session) {
    return redirect(`/${user.name}/settings/profile`);
  }
  return (
    <>
      <Header />
      <div className="flex h-screen flex-col items-center justify-center px-2">
        <div className="flex gap-12">
          <AlertDialogDemo />
        </div>
      </div>
    </>
  );
}
