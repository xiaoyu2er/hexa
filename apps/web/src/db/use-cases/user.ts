import { GitHubUser, GoogleUser } from "@/types";
import {
  createUser,
  getUserByEmail,
  updateUserProfile,
} from "../data-access/user";
import {
  createGithubAccount,
  createGoogleAccount,
} from "../data-access/account";
import { isStored, storage } from "@/lib/storage";

export async function createUserByGithubAccount(githubUser: GitHubUser) {
  let existingUser = await getUserByEmail(githubUser.email);

  if (!existingUser) {
    existingUser = await createUser({
      email: githubUser.email,
      emailVerified: true,
      avatarUrl: githubUser.avatar_url,
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
    });
  }

  if (!existingUser) {
    throw new Error("Failed to create user");
  }

  await createGoogleAccount(existingUser.id, googleUser);
  return existingUser;
}

export async function uploadUserProfile(uid: string, imageUrl: string | null) {
  if (imageUrl && !isStored(imageUrl)) {
    console.log("uploadUserProfile", uid, imageUrl);
    const { url } = await storage.upload(`avatars/${uid}`, imageUrl);
    console.log("uploadUserProfile", url);
    await updateUserProfile(uid, url);
  }
}
