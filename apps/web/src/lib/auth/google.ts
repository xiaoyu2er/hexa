import { Google } from "arctic";
import { PUBLIC_URL } from "@/lib/const";

// if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
//   throw new Error("Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET");
// }

export const google = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  `${PUBLIC_URL}/oauth/google/callback`,
);
