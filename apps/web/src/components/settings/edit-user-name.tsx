import { validateRequest } from "@/lib/auth";
import { Button } from "@hexa/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@hexa/ui/card";
import { Input } from "@hexa/ui/input";

export async function EditUserName() {
  const { user } = await validateRequest();
  return (
    <Card x-chunk="dashboard-04-chunk-1">
      <CardHeader>
        <CardTitle>Your Name</CardTitle>
        <CardDescription>
          This will be your display name on Hexa.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <Input placeholder="Store Name" value={user?.name!} />
        </form>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button>Save</Button>
      </CardFooter>
    </Card>
  );
}
