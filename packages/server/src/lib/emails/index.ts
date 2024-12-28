'use server';

import OrgInviteTemplate from '@hexa/email-templates/org-invite';
import VerifyCodeAndUrlTemplate from '@hexa/email-templates/verify-code-and-url';
import { NEXT_PUBLIC_APP_NAME } from '@hexa/env';
import { ApiError } from '@hexa/lib';
import { getInviteUrl } from '@hexa/lib';
import type { QueryInviteType } from '@hexa/server/schema/org-invite';
import { type CreateEmailResponseSuccess, Resend } from 'resend';
import type { Simplify } from 'type-fest';

type CreateBatchSuccessResponse = Simplify<
  Awaited<ReturnType<typeof Resend.prototype.batch.send>>['data']
>;

export async function sendOrgInviteEmails(
  invites: QueryInviteType[]
): Promise<CreateBatchSuccessResponse> {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  // if RESEND_API_KEY is not set, we are in development mode
  if (!RESEND_API_KEY) {
    return invites.map((invite) => ({
      url: getInviteUrl(invite.token),
    })) as unknown as CreateBatchSuccessResponse;
  }

  const resend = new Resend(RESEND_API_KEY);

  try {
    const { data, error } = await resend.batch.send(
      // @ts-ignore text is not required
      invites.map((invite) => ({
        from: 'Hexa <noreply@hexa.im>',
        to: invite.email,
        react: OrgInviteTemplate({
          email: invite.email,
          orgName: invite.org.name,
          inviterName: invite.inviter.name,
          inviterEmail: invite.inviter.email ?? '',
          role: invite.role,
          expiresAt: invite.expiresAt,
          acceptUrl: getInviteUrl(invite.token),
        }),
      }))
    );

    if (error) {
      throw error;
    }
    if (!data) {
      throw new ApiError('INTERNAL_SERVER_ERROR', 'No data returned');
    }
    return data;
  } catch (_error) {
    throw new ApiError('INTERNAL_SERVER_ERROR', 'Failed to send email');
  }
}

export async function sendVerifyCodeAndUrlEmail(
  email: string,
  code: string,
  url: string
): Promise<{
  email: string;
  code?: string;
  url?: string;
  resend: CreateEmailResponseSuccess;
}> {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!RESEND_API_KEY) {
    return { code, email, url, resend: { id: 'test' } };
  }

  const resend = new Resend(RESEND_API_KEY);

  try {
    const { data, error } = await resend.emails.send({
      from: 'Hexa <noreply@hexa.im>',
      to: [email],
      subject: 'Verify your code',
      react: VerifyCodeAndUrlTemplate({
        email,
        code,
        url,
        appName: NEXT_PUBLIC_APP_NAME ?? 'Hexa',
      }),
    });

    if (error) {
      throw error;
    }
    if (!data) {
      throw new ApiError('INTERNAL_SERVER_ERROR', 'No data returned');
    }
    return { email, resend: data };
  } catch (_error) {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.error('sendVerifyCodeAndUrlEmail', _error);
    throw new ApiError('INTERNAL_SERVER_ERROR', 'Failed to send email');
  }
}
