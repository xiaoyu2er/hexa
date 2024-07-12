import React from "react";
import { Hr, Link, Section, Text } from "@react-email/components";

import VerifyCodeTemplate from "./VerifyCode";

interface VerifyCodeAndUrlProps {
  email: string;
  code: string;
  url?: string;
}
export default function VerifyCodeAndUrlTemplate({
  email,
  code,
  url,
}: VerifyCodeAndUrlProps) {
  return (
    <VerifyCodeTemplate code={code} email={email}>
      {url && (
        <>
          <Hr />
          <Text className="text-sm leading-6 text-black">
            Or, please click the link below to verify your email address:
          </Text>
          <Section className="my-8 text-center">
            <Link
              className="rounded-full bg-black px-6 py-3 text-center text-[12px] font-semibold text-white no-underline"
              href={url}
            >
              Verify Email
            </Link>
          </Section>
          <Text className="text-sm leading-6 text-black">
            Also, you can copy and paste this URL into your browser:
          </Text>
          <Text className="max-w-sm flex-wrap break-words font-medium text-purple-600 no-underline">
            {url}
          </Text>
        </>
      )}
    </VerifyCodeTemplate>
  );
}

VerifyCodeAndUrlTemplate.PreviewProps = {
  email: "test@example.com",
  code: "123456",
  url: "https://example.com",
} as VerifyCodeAndUrlProps;
