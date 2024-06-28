import { validateRequest } from "@/lib/auth/validate-request";
import { Logout } from "../components/Logout";
import { Login } from "../components/Login";
import { SignUp } from "../components/SignUp";

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
          <Login />
          <SignUp />
        </div>
      )}
    </div>
  );
}
