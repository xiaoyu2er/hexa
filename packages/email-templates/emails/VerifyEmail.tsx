import React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import Footer from "./components/Footer";

interface VerifyEmailTemplateProps {
  email: string;
  url: string;
  code: string;
}
export default function VerifyEmailTemplate({
  email,
  url,
  code,
}: VerifyEmailTemplateProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify Your Email: {code}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-10 max-w-[500px] rounded border border-solid border-gray-200 px-10 py-5">

            <Heading className="mx-0 my-7 p-0 text-center text-xl font-semibold text-black">
              Verify your email address
            </Heading>
            <Text className="text-sm leading-6 text-black">
              Welcome to Hexa.im!
            </Text>

            <Text className="text-sm leading-6 text-black">
              Thanks for starting account creation process. We want to make sure it's really you. Please enter the following verification code when prompted. If you don't want to create an account, you can ignore this message.
            </Text>

            <Text className="text-l font-semibold text-black text-center my-2">
              Verification code
            </Text>

            <Section className="max-auto bg-slate-200 flex items-center justify-center ">
              <Text className="text-xl">{code}</Text>
            </Section>

            <Text className="text-sm text-center mt-2 mb-4">
              This code is valid for 10 minutes
            </Text>

            <Hr />

            <Text className="text-sm leading-6 text-black">
              Or, please click the link below to sign in to your account.
            </Text>
            <Section className="my-8 text-center">
              <Link
                className="rounded-full bg-black px-6 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={url}
              >
                Sign in
              </Link>
            </Section>
            <Text className="text-sm leading-6 text-black">
              Also, you can copy and paste this URL into your browser:
            </Text>
            <Text className="max-w-sm flex-wrap break-words font-medium text-purple-600 no-underline">
              {url}
            </Text>
            <Footer email={email} />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}


VerifyEmailTemplate.PreviewProps = {
  email: "test@example.com",
  url: "https://example.com/verify-email?code=123456",
  code: "123456",
} as VerifyEmailTemplateProps;