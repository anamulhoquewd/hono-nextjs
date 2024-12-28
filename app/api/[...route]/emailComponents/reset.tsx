import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

interface EmailTemplateProps {
  username: string;
  resetLink: string;
}

export const PasswordResetEmail = ({
  username,
  resetLink,
}: EmailTemplateProps) => {
  return (
    <Html>
      <Head />
      <Preview>Password Reset Request</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="mt-[20px]">
              <Text className="text-2xl font-bold text-gray-800 mb-4">
                Password Reset Request
              </Text>
              <Text className="text-black text-xl font-semibold mb-4">
                Hello {username},
              </Text>
              <Text className="text-gray-600 text-base mb-6">
                You requested to reset your password. Click the link below to
                reset it:
              </Text>
              <Section className="mb-6">
                <Link
                  href={resetLink}
                  className="text-blue-600 break-all text-base"
                >
                  {resetLink}
                </Link>
              </Section>
              <Text className="text-gray-600 text-base mb-6">
                If you did not request this, please ignore this email.
              </Text>
              <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
              <Text className="text-gray-500 text-sm text-center">
                This is an automated email. Please do not reply to this message.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default PasswordResetEmail;
