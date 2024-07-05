import { GitHubUser, GoogleUser } from "@/types";
import { createUser, getUserByEmail } from "../data-access/user";
import {
  createGithubAccount,
  createGoogleAccount,
} from "../data-access/account";

export async function createUserByGithubAccount(githubUser: GitHubUser) {
  let existingUser = await getUserByEmail(githubUser.email);

  if (!existingUser) {
    existingUser = await createUser({
      email: githubUser.email,
      emailVerified: true,
      avatarUrl: githubUser.avatar_url,
      name: githubUser.name,
    });
  }

  if (!existingUser) {
    throw new Error("Failed to create user");
  }
  await createGithubAccount(existingUser.id, githubUser);
  return existingUser;
}

export async function createUserByGoogleAccount(googleUser: GoogleUser) {
  let existingUser = await getUserByEmail(googleUser.email);

  if (!existingUser) {
    existingUser = await createUser({
      email: googleUser.email,
      emailVerified: true,
      avatarUrl: googleUser.picture,
      name: googleUser.name,
    });
  }

  if (!existingUser) {
    throw new Error("Failed to create user");
  }

  await createGoogleAccount(existingUser.id, googleUser);
  return existingUser;
}
