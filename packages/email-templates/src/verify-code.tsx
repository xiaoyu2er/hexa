import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import type React from 'react';
import Footer from './components/footer';

interface VerifyCodeTemplateProps {
  email: string;
  code: string;
  appName: string;
  children?: React.ReactNode;
}
export default function VerifyCodeTemplate({
  email,
  code,
  children,
  appName,
}: VerifyCodeTemplateProps) {
  return (
    <Html>
      <Head />
      <Preview>{code} is your verification code</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-10 max-w-[500px] rounded border border-gray-200 border-solid px-10 py-5">
            <Heading className="mx-0 my-7 p-0 text-center font-semibold text-black text-xl">
              Verify your code
            </Heading>
            <Text className="text-black text-sm leading-6">
              Welcome to {appName}!
            </Text>

            <Text className="text-black text-sm leading-6">
              We want to make sure it's really you. Please enter the following
              verification code when prompted. You can ignore this message if
              you didn't request a verification.
            </Text>

            <Text className="my-2 text-center font-semibold text-black text-l">
              Verification code
            </Text>

            <Section className="max-auto bg-slate-200">
              <Text className="text-center text-xl">{code}</Text>
            </Section>

            <Text className="mt-2 mb-4 text-center text-sm">
              This code is valid for 10 minutes
            </Text>

            {children}

            <Footer email={email} />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

VerifyCodeTemplate.PreviewProps = {
  email: 'test@example.com',
  code: '123456',
  url: 'https://example.com',
  appName: 'Hexa',
} as VerifyCodeTemplateProps;
