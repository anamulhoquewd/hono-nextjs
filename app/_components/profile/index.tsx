import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserAvatar } from "./avatar";
import useUsers from "@/app/_hooks/useUsers";
import AddUsersDialog from "@/app/_components/auth/addUsersDialog";
import ChangePassForms from "@/app/_components/auth/changePass";

export function UserProfile() {
  const {
    setIsOpen,
    isOpen,
    setIsEditing,
    changePassHandler,
    changePassForm,

    isChangePassOpen,
    setIsChangePassOpen,

    updateUserHandler,
    registerForm,
    profile,
    setDefaultValues,
    isEditing,
  } = useUsers();
  return (
    <>
      <Card className="w-full mx-auto">
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Manage your profile settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* avatar */}
          <UserAvatar />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={profile?.name} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" value={profile?.phone} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" value={profile?.email} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nid">NID</Label>
              <Input id="nid" name="nid" value={profile?.NID} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" name="role" value={profile?.role} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={profile?.address}
                disabled
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            onClick={() => {
              setIsChangePassOpen(true);
            }}
          >
            Change Password
          </Button>
          <Button
            onClick={() => {
              setIsEditing(true);
              setIsOpen(true);
            }}
          >
            Update
          </Button>
        </CardFooter>
      </Card>

      <AddUsersDialog
        isOpen={isOpen}
        onSubmit={updateUserHandler}
        setIsOpen={setIsOpen}
        form={registerForm}
        title="Profile"
        values={profile}
        setValues={setDefaultValues}
        nidDisabled={isEditing}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />

      <Dialog
        open={isChangePassOpen}
        onOpenChange={(open) => {
          if (!open) {
            changePassForm.reset({
              prevPassword: "",
              newPassword: "",
            });
          }
          setIsChangePassOpen(open);
        }}
      >
        <DialogContent className="bg-white rounded-lg w-[90vw] sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Change your password for security purposes.
            </DialogDescription>
          </DialogHeader>
          <ChangePassForms form={changePassForm} onSubmit={changePassHandler} />
        </DialogContent>
      </Dialog>
    </>
  );
}
