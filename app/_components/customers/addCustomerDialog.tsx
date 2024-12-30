import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CustomerRegisterForms } from "@/app/_components/forms";

function AddCustomersDialog({
  onSubmit,
  isOpen,
  setIsOpen,
  title,
  form,
  values,
  setValues,
  isEditing,
  setIsEditing,
}: {
  form: any;
  onSubmit: (values: any) => void;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  title: string;
  values?: any;
  setValues: (value: any) => void;
  isEditing?: boolean;
  setIsEditing: (value: boolean) => void;
}) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setValues(null);
          setIsEditing(false);
          form.reset({
            name: "",
            phone: "",
            secondaryPhone: "",
            address: "",
            defaultPrice: 0,
            defaultQuantity: 1,
          });
        }
        setIsOpen(open);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? `Edit ${title}` : `Add ${title}`}
          </DialogTitle>
          <DialogDescription>
            Please fill out the form below to{" "}
            {isEditing ? `edit the ${title}` : `add a new ${title}`}
            to your catering service. Ensure all mandatory information is
            provided accurately.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-96 w-full">
          <CustomerRegisterForms
            defaultValues={values}
            onSubmit={onSubmit}
            form={form}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default AddCustomersDialog;
