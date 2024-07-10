import { GitHubUser, GoogleUser } from "@/types";
import { createUser, getUserEmail } from "../data-access/user";
import {
  createGithubAccount,
  createGoogleAccount,
} from "../data-access/account";

export async function createUserByGithubAccount(githubUser: GitHubUser) {
  const emailItem = await getUserEmail(githubUser.email);
  let existingUser = emailItem?.user;

  if (!existingUser) {
    existingUser = await createUser({
      email: githubUser.email,
      verified: true,
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
  const emailItem = await getUserEmail(googleUser.email);
  let existingUser = emailItem?.user

  if (!existingUser) {
    existingUser = await createUser({
      email: googleUser.email,
      verified: true,
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
