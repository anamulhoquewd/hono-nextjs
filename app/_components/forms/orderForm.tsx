import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  SelectInputField,
  TextInputField,
} from "@/app/_components/inputFields";
import { useEffect } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

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
            quantity: "",
            price: "",
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
              label="Quantity"
              placeholder="Enter quantity"
              type="number"
            />

            <TextInputField
              name="price"
              form={form}
              label="Price"
              placeholder="Enter price"
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

export default OrdersRegisterForm;
