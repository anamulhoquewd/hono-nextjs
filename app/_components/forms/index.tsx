import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import {
  SelectInputField,
  TextAreaInputField,
  TextInputField,
} from "@/app/_components/inputFields";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";

interface YourFormType {
  onSubmit: (values: any) => void;
  form: any;
  defaultValues?: any;
  isEmailDisabled?: boolean;
  isNidDisabled?: boolean;
  isEditing?: boolean;
}

interface FormValuesProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setDefaultValues: React.Dispatch<React.SetStateAction<any>>;
  onSubmit: (data: any) => void;
  customers: any;
  form: any;
  defaultValues?: any;
}

const UserRegisterForms = ({
  onSubmit,
  form,
  defaultValues,
  isEmailDisabled = false,
  isNidDisabled = false,
  isEditing = false,
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
        <TextInputField
          name="email"
          form={form}
          label="Email"
          placeholder="Type your email"
          disabled={isEmailDisabled}
        />
        <TextInputField
          name="NID"
          form={form}
          label="NID"
          placeholder="Type your NID number"
          disabled={isNidDisabled}
        />
        <TextInputField
          name="phone"
          form={form}
          label="Phone"
          placeholder="Type your phone number"
        />
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

        <TextInputField
          name="defaultPrice"
          form={form}
          label="Default Price"
          placeholder="Enter default price"
          type="number"
        />

        <TextInputField
          name="defaultQuantity"
          form={form}
          label="Default Quantity (Optional)"
          placeholder="Enter default quantity"
          type="number"
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

function OrdersRegisterForm({
  isOpen,
  setIsOpen,
  isEditing,
  setIsEditing,
  setDefaultValues,
  onSubmit,
  customers,
  form,
  defaultValues,
}: FormValuesProps) {
  useEffect(() => {
    if (defaultValues) {
      console.log("defaultValues", defaultValues);
      form.reset(defaultValues);
    }
  }, [defaultValues, form]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setIsEditing(false);
          setDefaultValues(null);
          form.reset({
            quantity: 0,
            customer: "",
          });
        }
        setIsOpen(open);
      }}
    >
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Existing Order" : "Add New Order"}
          </DialogTitle>
        </DialogHeader>

        {/* Add Order Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-1 space-y-6"
          >
            <TextInputField
              name="searchTerm"
              form={form}
              label="Search Customer"
              placeholder="Search by name or ID"
              disabled={isEditing}
            />

            {defaultValues && defaultValues?._id ? (
              <SelectInputField
                name="customer"
                form={form}
                label="Customer"
                placeholder="Select customer"
                items={[
                  {
                    name: `${defaultValues.name} - ${defaultValues.customer.slice(0, 5)}`,
                    value: defaultValues.customer,
                  },
                ]}
                disabled={isEditing}
              />
            ) : (
              <SelectInputField
                name="customer"
                form={form}
                label="Customer"
                placeholder="Select customer"
                items={customers.map((c: any) => ({
                  name: `${c.name} - ${c._id.slice(0, 5)}`,
                  value: c._id,
                }))}
                disabled={isEditing}
              />
            )}

            <TextInputField
              name="quantity"
              form={form}
              label="Quantity (optional)"
              placeholder="Enter quantity"
              type="number"
            />

            <div className="flex justify-end space-x-2">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

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

export {
  CustomerRegisterForms,
  UserRegisterForms,
  OrdersRegisterForm,
  UserLoginForms,
};
