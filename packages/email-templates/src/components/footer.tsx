import { Hr, Tailwind, Text } from '@react-email/components';

interface FooterProps {
  email: string;
}

export default function Footer({ email }: FooterProps) {
  return (
    <Tailwind>
      <Hr className="mx-0 my-6 w-full border border-gray-200" />
      <Text className="text-[12px] text-gray-500 leading-6">
        This email was intended for <span className="text-black">{email}</span>.
        If you were not expecting this email, you can ignore this email.
      </Text>
    </Tailwind>
  );
}

Footer.PreviewProps = {
  email: 'test@example.com',
} as FooterProps;
