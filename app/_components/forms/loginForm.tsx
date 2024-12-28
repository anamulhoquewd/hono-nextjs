import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { TextInputField } from "@/app/_components/inputFields";
import Link from "next/link";

function UserLoginForms({
  onSubmit,
  form,
}: {
  onSubmit: (values: any) => void;
  form: any;
}) {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={`p-1 mr-1.5 space-y-6`}
      >
        <TextInputField
          name="email"
          form={form}
          label="Email"
          placeholder="dev@anam.com"
        />
        <TextInputField
          name="password"
          form={form}
          label="Password"
          type="password"
          placeholder="********"
        />

        <Button className="w-full" type="submit">
          Log in
        </Button>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Have you forgotten your password??{" "}
            <Link
              href="/auth/forgot-password"
              className="font-medium text-primary hover:underline"
            >
              Forgot Password
            </Link>
          </p>
        </div>
      </form>
    </Form>
  );
}

export { UserLoginForms };
