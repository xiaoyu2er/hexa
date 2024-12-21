'use server';

import OrgInviteTemplate from '@hexa/email-templates/org-invite';
import VerifyCodeAndUrlTemplate from '@hexa/email-templates/verify-code-and-url';
import { IS_DEVELOPMENT, NEXT_PUBLIC_APP_NAME } from '@hexa/env';
import { ApiError } from '@hexa/lib';
import { getInviteUrl } from '@hexa/lib';
import type { QueryInviteType } from '@hexa/server/schema/org-invite';
// @ts-ignore
import { getCloudflareContext } from '@opennextjs/cloudflare';
// @ts-ignore
import { Resend } from 'resend';

type CreateBatchSuccessResponse = Awaited<
  ReturnType<typeof Resend.prototype.batch.send>
>['data'];

export async function sendOrgInviteEmails(
  invites: QueryInviteType[]
): Promise<CreateBatchSuccessResponse> {
  if (IS_DEVELOPMENT) {
    return invites.map((invite) => ({
      url: getInviteUrl(invite.token),
    })) as unknown as CreateBatchSuccessResponse;
  }
  const { env } = await getCloudflareContext();
  const resend = new Resend(env.RESEND_API_KEY);

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
    throw new ApiError('INTERNAL_SERVER_ERROR', 'Failed to send email');
  }

  return data;
}

export async function sendVerifyCodeAndUrlEmail(
  email: string,
  code: string,
  url: string
): Promise<{ email: string; code: string; url: string }> {
  if (IS_DEVELOPMENT) {
    // sleep 1000;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { code, email, url };
  }
  const { env } = await getCloudflareContext();
  const resend = new Resend(env.RESEND_API_KEY);
  // @ts-ignore text is not required
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
    throw new ApiError('INTERNAL_SERVER_ERROR', 'Failed to send email');
  }

  return { email, ...data };
}
