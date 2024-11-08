// "use server";

// import { PUBLIC_URL } from "@/lib/const";
// import { sendVerifyCodeAndUrlEmail } from "@/lib/emails";
// import { OAuthSignupSchema, SignupSchema } from "@/lib/zod/schemas/auth";
// import { getDB } from "@/server/db";
// import {
//   getOAuthAccount,
//   updateOAuthAccount,
// } from "@/server/data-access/account";
// import { addDBToken } from "@/server/data-access/token";
// import {
//   createUser,
//   getEmail,
//   getUserByUsername,
//   getUserEmail,
//   updateUserPassword,
// } from "@/server/data-access/user";
// import { redirect } from "next/navigation";
// import {
//   ZSAError,
//   type inferServerActionInput,
//   type inferServerActionReturnTypeHot,
// } from "zsa";
// import { invalidateUserSessions, setSession } from "../session";
// import { getUserEmailProcedure } from "./procedures";

// export async function updateTokenAndSendVerifyEmail(
//   uid: string,
//   email: string,
// ): Promise<{ email: string }> {
//   const db = await getDB();
//   const { code: verificationCode, token } = await addDBToken(
//     db,
//     uid,
//     email,
//     "VERIFY_EMAIL",
//   );
//   const url = `${PUBLIC_URL}/verify-email?token=${token}`;
//   const data = await sendVerifyCodeAndUrlEmail(email, verificationCode, url);
//   console.log("sendVerifyCodeAndUrlEmail", data);
//   return data;
// }

// export const oauthSignupAction = turnstileProcedure
//   .createServerAction()
//   .input(OAuthSignupSchema)
//   .handler(async ({ input }) => {
//     const { username, oauthAccountId } = input;
//     const db = await getDB();
//     const oauthAcccount = await getOAuthAccount(db, oauthAccountId);
//     if (!oauthAcccount) {
//       throw new ZSAError("FORBIDDEN", "OAuth account not found");
//     }

//     const emailItem = await getUserEmail(db, oauthAcccount.email);

//     if (emailItem?.verified) {
//       throw new ZSAError("FORBIDDEN", "Email already exists");
//     }

//     const user = await createUser(db, {
//       email: oauthAcccount.email,
//       verified: true,
//       // we don't need password for oauth signup
//       password: null,
//       username,
//       avatarUrl: oauthAcccount.avatarUrl,
//       name: oauthAcccount.name,
//     });

//     if (!user) {
//       throw new ZSAError("INTERNAL_SERVER_ERROR", "Failed to create user");
//     }

//     await updateOAuthAccount(db, oauthAcccount.id, { userId: user.id });
//     await invalidateUserSessions(user.id);
//     await setSession(user.id);
//     redirect("/settings");
//   });

// export const resendVerifyEmailAction = getUserEmailProcedure
//   .createServerAction()
//   .handler(async ({ ctx }) => {
//     const { email } = ctx;

//     if (!email) {
//       throw new ZSAError("FORBIDDEN", "User not found");
//     }

//     return await updateTokenAndSendVerifyEmail(email.user.id, email.email);
//   });

// export type ResendCodeActionInput = inferServerActionInput<
//   typeof resendVerifyEmailAction
// >;

// export type ResendCodeActionReturnType = inferServerActionReturnTypeHot<
//   typeof resendVerifyEmailAction
// >;
