import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import Footer from './components/footer';

interface OrgInviteTemplateProps {
  email: string;
  orgName: string;
  inviterName: string;
  inviterEmail: string;
  role: string;
  expiresAt: string;
  acceptUrl: string;
}

export default function OrgInviteTemplate({
  email,
  orgName,
  inviterName,
  inviterEmail,
  role,
  expiresAt,
  acceptUrl,
}: OrgInviteTemplateProps) {
  return (
    <Html>
      <Head />
      <Preview>You've been invited to join {orgName}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-10 max-w-[500px] rounded border border-gray-200 border-solid px-10 py-5">
            <Heading className="mx-0 my-7 p-0 text-center font-semibold text-black text-xl">
              Join {orgName}
            </Heading>

            <Text className="text-black text-sm leading-6">Hi there!</Text>

            <Text className="text-black text-sm leading-6">
              <span className="font-semibold">{inviterName}</span> (
              {inviterEmail}) has invited you ({email}) to join
              <span className="font-semibold">{orgName}</span> as a
              <span className="font-semibold">{role.toLowerCase()}</span>.
            </Text>

            <Section className="my-8 text-center">
              <Button
                className="rounded-full bg-black px-6 py-3 text-center font-semibold text-[12px] text-white no-underline"
                href={acceptUrl}
              >
                Accept Invitation
              </Button>
            </Section>

            <Text className="text-black text-sm leading-6">
              Or, you can copy and paste this URL into your browser:
            </Text>

            <Text className="max-w-sm flex-wrap break-words font-medium text-purple-600 no-underline">
              {acceptUrl}
            </Text>

            <Text className="text-gray-500 text-sm">
              This invitation will expire on
              {new Date(expiresAt).toLocaleString()}
            </Text>

            <Footer email={email} />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

OrgInviteTemplate.PreviewProps = {
  email: 'test@example.com',
  orgName: 'Acme Inc',
  inviterName: 'John Doe',
  inviterEmail: 'john@example.com',
  role: 'MEMBER',
  expiresAt: new Date().toISOString(),
  acceptUrl: 'https://example.com/accept-invite',
} as OrgInviteTemplateProps;
