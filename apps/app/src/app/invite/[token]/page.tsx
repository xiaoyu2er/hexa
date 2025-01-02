import { APP_URL } from '@hexa/env';
import { getSession } from '@hexa/server/session';
import { redirect } from 'next/navigation';

export default async function InvitePage({
  params,
}: { params: Promise<{ token: string }> }) {
  const session = await getSession();

  if (!session.user) {
    return redirect(`/login?next=${APP_URL}/invite/${(await params).token}`);
  }
  return <div>Invite</div>;
}
