import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserRegisterForms } from "@/app/_components/forms";

interface Props {
  onSubmit: (values: any) => void;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  title: string;
  form: any;
  values?: any;
  setValues: (value: any) => void;
  isEmailDisabled?: boolean;
  isNidDisabled?: boolean;
  isEditing?: boolean;
  setIsEditing: (value: boolean) => void;
  isCustomer?: boolean;
}

function AddUsersDialog({
  onSubmit,
  isOpen,
  setIsOpen,
  title,
  form,
  values,
  setValues,
  isEmailDisabled = false,
  isNidDisabled = false,
  isEditing,
  setIsEditing,
}: Props) {
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
            email: "",
            NID: "",
            avatar: undefined,
            address: "",
          });
        }
        setIsOpen(open);
      }}
    >
      <DialogContent className="bg-white w-[90vw] rounded-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? `Edit ${title}` : `Add ${title}`}
          </DialogTitle>
          <DialogDescription className="hidden lg:block">
            {isEditing
              ? `Update the user's information using the form below. Make sure to review the changes before submitting`
              : "Fill out the form below to register a new user. Please ensure all required fields are completed accurately to create an account."}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[70vh] sm:h-96 w-full">
          <UserRegisterForms
            defaultValues={values}
            onSubmit={onSubmit}
            form={form}
            isEmailDisabled={isEmailDisabled}
            isNidDisabled={isNidDisabled}
            isEditing={isEditing}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default AddUsersDialog;
