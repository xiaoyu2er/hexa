import type { AppType } from '@/server/route';
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
  ): Promise<InferResponseType<T>> => {
    const res = await api(args, opt);
    const status = res.status;
    const isErrorCode = status >= 400;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    let data: any = {};
    try {
      data = await res.json();
    } catch (_e) {
      if (isErrorCode) {
        throw new Error(`[${res.status}] ${res.statusText}`);
      }
      return {} as InferResponseType<T>;
    }
    if (data.error || isErrorCode) {
      if (data.error.name === 'ZodError') {
        throw new ZodError(data.error.issues);
      }
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
// passcode
export const $sendPasscode = h(api['send-passcode'].$post);
export const $rensedPasscode = h(api['resend-passcode'].$post);
export const $verifyPasscode = h(api['verify-passcode'].$post);
// login
export const $loginPassword = h(api['login-password'].$post);
// reset password
export const $resetPassword = h(api['reset-password'].$post);
// signup
export const $signup = h(api.signup.$post);
// oauth
export const $oauthSignup = h(api['oauth-signup'].$post);
// logout
export const $logout = h(api.logout.$post);

// ==================== User ====================
// user
export const $getUserInfo = h(api.user.info.$get);
export const $getUserEmails = h(api.user.emails.$get);
export const $getUserOauthAccounts = h(api.user['oauth-accounts'].$get);
export const $updateUserPrimaryEmail = h(api.user.emails.primary.$put);
export const $updateUserDisplayName = h(api.user['display-name'].$put);
export const $updateUsername = h(api.user.username.$put);
export const $addUserEmail = h(api.user.emails.$post);
export const $deleteUserEmail = h(api.user.emails.$delete);
export const $updateUserAvatar = h(api.user.avatar.$put);
export const $deleteUser = h(api.user.$delete);
export const $deleteUserOauthAccount = h(api.user['oauth-accounts'].$delete);
export const $updateUserDefaultWorkspace = h(
  api.user['default-workspace'].$put
);
// ==================== Workspace ====================
// workspace
export const $getWorkspaces = h(api.workspace.all.$get);
export const $getWorkspaceBySlug = h(api.workspace[':slug'].$get);
export const $createWorkspace = h(api.workspace.new.$post);
export const $deleteWorkspace = h(api.workspace[':workspaceId'].$delete);
export const $updateWorkspaceName = h(api.workspace[':workspaceId'].name.$put);
export const $updateWorkspaceSlug = h(api.workspace[':workspaceId'].slug.$put);
export const $updateWorkspaceAvatar = h(
  api.workspace[':workspaceId'].avatar.$put
);
