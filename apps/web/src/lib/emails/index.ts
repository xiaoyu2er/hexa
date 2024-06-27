import { EmailTemplate } from './hello';
import { Resend } from 'resend';

async function sendEmail(link: string) {
    const resend = new Resend(process.env.RESEND_API_KEY);

    // @ts-ignore text is not required
    const { data, error } = await resend.emails.send({
        from: 'Hexa <noreply@hexa.im>',
        to: ['me@zyq.io'],
        subject: 'Hello world',
        react: EmailTemplate({ link }),
    });

    if (error) {
        throw error;
    }

    return data;

}


export {
    sendEmail
}