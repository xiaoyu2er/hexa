import { GitHub } from "arctic";

// if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
//   throw new Error("GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET are required");
// }

export const github = new GitHub(
  process.env.GITHUB_CLIENT_ID!,
  process.env.GITHUB_CLIENT_SECRET!,
);
