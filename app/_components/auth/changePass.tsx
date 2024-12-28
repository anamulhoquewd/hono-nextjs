import React from "react";
import { Button } from "@/components/ui/button";
import { TextInputField } from "@/app/_components/inputFields";
import { Form } from "@/components/ui/form";

function ChangePassForms({
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
          name="prevPassword"
          form={form}
          label="Previous Password"
          placeholder="Enter your previous password"
          type="password"
        />
        <TextInputField
          name="newPassword"
          form={form}
          label="New Password"
          placeholder="Enter your new password"
          type="password"
        />
        <TextInputField
          name="confirmPassword"
          form={form}
          label="Confirm New Password"
          type="password"
          placeholder="Enter your new password again"
        />
        <Button type="submit">Change</Button>
      </form>
    </Form>
  );
}

export default ChangePassForms;
