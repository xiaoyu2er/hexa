import type { AppType } from '@/lib/route';
import {
  type ClientRequestOptions,
  type InferRequestType,
  type InferResponseType,
  hc,
} from 'hono/client';
import { ZodError } from 'zod';

export const client = hc<AppType>('/');
const api = client.api;

// This is a helper function that wraps the API functions to handle errors
function h<
  T extends (
    args: InferRequestType<T>,
    opt?: ClientRequestOptions
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  ) => Promise<any>,
>(api: T) {
  return async (
    args: InferRequestType<T>,
    opt?: ClientRequestOptions
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
  ): Promise<InferResponseType<T>> => {
    const res = await api(args, opt);
    const status = res.status;
    const isErrorCode = status >= 400;
    // redirect
    if (res.redirected && res.url) {
      location.href = res.url;
      return {} as InferResponseType<T>;
    }
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    let data: InferResponseType<T>;
    try {
      data = await res.json();
    } catch (_e) {
      if (isErrorCode) {
        throw new Error(`[${res.status}] ${res.statusText}`);
      }

      return {} as InferResponseType<T>;
    }
    // @ts-ignore
    if (data.error || isErrorCode) {
      // @ts-ignore
      if (data.error.name === 'ZodError') {
        // @ts-ignore
        throw new ZodError(data.error.issues);
      }
      // @ts-ignore
      if (data.error.message) {
        // @ts-ignore
        throw new Error(data.error.message);
      }
      throw new Error(`[${res.status}] ${res.statusText}`);
    }
    return data;
  };
}

export type InferApiResponseType<
  T extends (
    args: InferRequestType<T>,
    opt?: ClientRequestOptions
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  ) => Promise<any>,
> = Awaited<ReturnType<T>>;

// ==================== Auth ====================
// login
export const $loginPassword = h(api['login-password'].$post);
export const $loginPasscodeSendPasscode = h(
  api['login-passcode']['send-passcode'].$post
);
export const $loginPasscodeResendPasscode = h(
  api['login-passcode']['resend-passcode'].$post
);
export const $loginPasscodeVerifyPasscode = h(
  api['login-passcode']['verify-passcode'].$post
);
// reset password
export const $resetPasswordSendPasscode = h(
  api['reset-password']['send-passcode'].$post
);
export const $resetPasswordResendPasscode = h(
  api['reset-password']['resend-passcode'].$post
);
export const $resetPasswordVerifyPasscode = h(
  api['reset-password']['verify-passcode'].$post
);
export const $resetPassword = h(api['reset-password'].$post);

// signup
export const $signupSendPasscode = h(api.signup['send-passcode'].$post);
export const $signupResendPasscode = h(api.signup['resend-passcode'].$post);
export const $signupVerifyPasscode = h(api.signup['verify-passcode'].$post);
// oauth
export const $oauthSignup = h(api['oauth-signup'].$post);
export const $oauthSignupResendPasscode = h(
  api['oauth-signup']['resend-passcode'].$post
);
export const $oauthSignupVerifyPasscode = h(
  api['oauth-signup']['verify-passcode'].$post
);

// logout
export const $logout = h(api.logout.$post);

// ==================== User ====================
// user
export const $getUserInfo = h(api.user.info.$get);
export const $getUserEmails = h(api.user.emails.$get);
export const $getUserOauthAccounts = h(api.user['oauth-accounts'].$get);
export const $updateUserPrimaryEmail = h(api.user['set-primary-email'].$put);
export const $updateUserName = h(api.user['update-name'].$put);
export const $updateUserPassword = h(api.user['update-password'].$put);

export const $addUserEmailSendPasscode = h(
  api.user['add-email']['send-passcode'].$post
);
export const $addUserEmailResendPasscode = h(
  api.user['add-email']['resend-passcode'].$post
);
export const $addUserEmailVerifyPasscode = h(
  api.user['add-email']['verify-passcode'].$post
);

export const $deleteUserEmail = h(api.user['delete-email'].$delete);
export const $updateUserAvatar = h(api.user['update-avatar'].$put);
export const $deleteUser = h(api.user['delete-user'].$delete);
export const $deleteUserOauthAccount = h(
  api.user['delete-oauth-account'].$delete
);
export const $updateUserDefaultProject = h(
  api.user['update-default-project'].$put
);
export const $checkEmail = h(api.email.$post);

// ==================== Project ====================
export const $getAccessibleProjects = h(api.project.all.$get);
export const $getProject = h(api.project[':projectId'].$get);
export const $createProject = h(api.project['create-project'].$post);
export const $deleteProject = h(api.project['delete-project'].$delete);
export const $updateProjectName = h(api.project['update-project-name'].$put);
export const $updateProjectSlug = h(api.project['update-project-slug'].$put);
export const $updateProjectAvatar = h(
  api.project['update-project-avatar'].$put
);

// ==================== Org ====================
export const $getOrgs = h(api.org.all.$get);
export const $createOrg = h(api.org.$post);
export const $deleteOrg = h(api.org['delete-org'].$delete);
export const $getOrgByName = h(api.org[':name'].$get);
export const $updateOrgName = h(api.org['update-org-name'].$put);
