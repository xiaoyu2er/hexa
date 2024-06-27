
import { Resend } from 'resend';
import { VerifyEmailTemplate } from './verify-email';

async function sendEmail(link: string) {
    const resend = new Resend(process.env.RESEND_API_KEY);

    // @ts-ignore text is not required
    const { error } = await resend.emails.send({
        from: 'Hexa <noreply@hexa.im>',
        to: ['me@zyq.io'],
        subject: 'Hello world',
        react: VerifyEmailTemplate({ link }),
    });

    if (error) {
        throw error;
    }
}


export {
    sendEmail
}