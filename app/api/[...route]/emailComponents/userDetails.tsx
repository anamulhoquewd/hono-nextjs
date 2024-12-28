import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

interface EmailTemplateProps {
  name: string;
  email: string;
  password: string;
}
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const EmailTemplate = ({
  name,
  email,
  password,
}: EmailTemplateProps) => {
  const previewText = `Your account has been created successfully`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-gray-100 my-auto mx-auto font-sans">
          <Container className="rounded mx-auto max-w-md w-full">
            <Section className="m-6">
              <div className="bg-gradient-to-r p-6 rounded-t-lg">
                <Text className="text-3xl font-bold text-primary text-center">
                  Your Account Details
                </Text>
              </div>
              <div className="bg-white p-6 rounded-b-lg shadow-lg">
                <Text className="text-black font-semibold text-xl mb-4">Hello {name},</Text>
                <Text className="text-black text-base mb-4">
                  Your account has been created successfully. Here are your
                  login details:
                </Text>
                <Section className="bg-gray-50 rounded-lg p-4 mb-4">
                  <Text className="text-sm font-medium text-gray-500">
                    Email:
                  </Text>
                  <Text className="text-base font-bold text-blue-600 mb-2">
                    {email}
                  </Text>
                  <Text className="text-sm font-medium text-gray-500">
                    Password:
                  </Text>
                  <Text className="text-base font-bold text-blue-600">
                    {password}
                  </Text>
                </Section>
                <Text className="text-red-600 font-bold bg-red-50 p-4 rounded-lg mb-4">
                  Please log in and change your password immediately for
                  security.
                </Text>
                <Button
                  target="_blank"
                  className="bg-blue-600 rounded py-3 px-5 text-white text-center font-semibold no-underline text-base"
                  href={`${baseUrl}/auth/log-in`}
                >
                  Log In Now
                </Button>
                <Text className="text-black text-base mt-4">
                  If you have any questions or concerns, please don't hesitate
                  to contact our support team.
                </Text>
                <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
                <Text className="text-[#666666] text-xs text-center">
                  This is an automated email. Please do not reply to this
                  message.
                </Text>
              </div>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default EmailTemplate;
