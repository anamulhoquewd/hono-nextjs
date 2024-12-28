import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import {
  SelectInputField,
  TextAreaInputField,
  TextInputField,
} from "@/app/_components/inputFields";

interface YourFormType {
  onSubmit: (values: any) => void;
  form: any;
  defaultValues?: any;
  emailDisabled?: boolean;
  nidDisabled?: boolean;
  isEditing?: boolean;
  isCustomer?: boolean;
}

const UserRegisterForms = ({
  onSubmit,
  form,
  defaultValues,
  emailDisabled = false,
  nidDisabled = false,
  isEditing = false,
  isCustomer = false,
}: YourFormType) => {
  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={`p-1 mr-1.5 space-y-6`}
      >
        <TextInputField
          name="name"
          form={form}
          label="Name"
          placeholder="Type your name"
        />
        {!isCustomer && (
          <TextInputField
            name="email"
            form={form}
            label="Email"
            placeholder="Type your email"
            disabled={emailDisabled}
          />
        )}
        {/* {!isEditing && !isCustomer && (
          <TextInputField
            name="password"
            form={form}
            label="Password"
            placeholder="Type your password"
            type="password"
          />
        )} */}
        {isCustomer && (
          <TextInputField
            name="secondaryPhone"
            form={form}
            label="Secondary Phone"
            placeholder="Type your secondary phone number"
          />
        )}

        <TextInputField
          name="phone"
          form={form}
          label="Phone"
          placeholder="Type your phone number"
        />
        {!isCustomer && (
          <TextInputField
            name="NID"
            form={form}
            label="NID"
            placeholder="Type your NID number"
            disabled={nidDisabled}
          />
        )}
        <TextInputField
          name="address"
          form={form}
          label="Address"
          placeholder="Type your address"
        />
        {!isEditing && (
          <SelectInputField
            name="role"
            disabled={true}
            form={form}
            label="Role"
            placeholder="Select a role"
            items={[
              { name: "Admin", value: "admin" },
              { name: "Manger", value: "manager" },
              { name: "Delivery Man", value: "delivery_man" },
              { name: "Customer", value: "customer" },
            ]}
          />
        )}

        <Button type="submit">{"Submit"}</Button>
      </form>
    </Form>
  );
};

const CustomerRegisterForms = ({
  onSubmit,
  form,
  defaultValues,
}: {
  onSubmit: (values: any) => void;
  form: any;
  defaultValues?: any;
}) => {
  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form]);
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={`p-1 mr-1.5 space-y-6`}
      >
        <TextInputField
          name="name"
          form={form}
          label="Name"
          placeholder="Anamul Hoque"
        />
        <TextInputField
          name="email"
          form={form}
          label="Email"
          placeholder="dev@anam.com"
        />
        <TextInputField
          name="phone"
          form={form}
          label="Phone"
          placeholder="019******62"
        />
        <TextInputField
          name="secondaryPhone"
          form={form}
          label="Secondary phone"
          placeholder="016******62"
        />
        <TextAreaInputField
          name="address"
          form={form}
          label="Address"
          placeholder="South Banasree, Dhaka."
        />

        <SelectInputField
          disabled={true}
          name="role"
          form={form}
          label="Role"
          placeholder="Select a role"
          items={[{ name: "Customer", value: "customer" }]}
        />
        <Button type="submit">{"Submit"}</Button>
      </form>
    </Form>
  );
};

export { CustomerRegisterForms, UserRegisterForms };
