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

interface VerifyCodeTemplateProps {
  email: string;
  code: string;
  children?: React.ReactNode;
}
export default function VerifyCodeTemplate({
  email,
  code,
  children,
}: VerifyCodeTemplateProps) {
  return (
    <Html>
      <Head />
      <Preview>{code} is your verification code</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-10 max-w-[500px] rounded border border-solid border-gray-200 px-10 py-5">
            <Heading className="mx-0 my-7 p-0 text-center text-xl font-semibold text-black">
              Verify your code
            </Heading>
            <Text className="text-sm leading-6 text-black">
              Welcome to {process.env.NEXT_PUBLIC_APP_NAME}
            </Text>

            <Text className="text-sm leading-6 text-black">
              We want to make sure it's really you. Please enter the following
              verification code when prompted. You can ignore this message if
              you didn't request a verification.
            </Text>

            <Text className="text-l font-semibold text-black text-center my-2">
              Verification code
            </Text>

            <Section className="max-auto bg-slate-200">
              <Text className="text-xl text-center">{code}</Text>
            </Section>

            <Text className="text-sm text-center mt-2 mb-4">
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
  email: "test@example.com",
  code: "123456",
  url: "https://example.com",
} as VerifyCodeTemplateProps;
