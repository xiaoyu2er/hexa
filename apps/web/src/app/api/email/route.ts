import { HelloEmailTemplate } from '@/lib/emails/hello';
import { resend } from '@/lib/emails';

export async function GET() {
  try {
    // @ts-ignore text is not required
    const { data, error } = await resend.emails.send({
      from: 'Hexa <noreply@hexa.im>',
      to: ['me@zyq.io'],
      subject: 'Hello world',
      react: HelloEmailTemplate({ message: 'Hello John' }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
