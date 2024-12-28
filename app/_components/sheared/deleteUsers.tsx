import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface Props {
  sectionTitle: string;
  handleDelete: any;
  setUserId: any;
  setIsOpen: (value: boolean) => void;
  isOpen: boolean;
}

function DeleteAccount({
  sectionTitle,
  handleDelete,
  isOpen,
  setIsOpen,
  setUserId,
}: Props) {
  const [prompt, setPrompt] = useState(""); // Local state to track the input value
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {sectionTitle}</AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            This action cannot be undone. This will permanently delete the{" "}
            {sectionTitle}&apos;s account and remove their data from our
            servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <br />
        <Label htmlFor="delete" className="font-semibold text-muted-foreground">
          Please type “DELETE ACCOUNT” below
        </Label>
        <Input
          id="delete"
          autoFocus
          onChange={(e) => setPrompt(e.target.value)}
        />
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => setUserId(null)}
            className="sm:hover:bg-white-2x"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={prompt !== "DELETE ACCOUNT"}
            onClick={handleDelete}
            className="bg-red-600 text-white transition-all duration-300 sm:hover:bg-red-700"
          >
            Delete Account
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteAccount;
