import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useUsers from "@/app/_hooks/useUsers";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function UserAvatar() {
  const { setIsAvatarOpen, profile, isAvatarOpen, uploadAvatar } = useUsers();

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-10">
        <Avatar className="w-32 h-32">
          <AvatarImage src={profile?.avatar} alt={profile?.name} />
          <AvatarFallback>{profile?.name.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">{profile?.name}</h2>
          <Button onClick={() => setIsAvatarOpen(true)}>Change Avatar</Button>
        </div>
      </div>

      <Dialog open={isAvatarOpen} onOpenChange={setIsAvatarOpen}>
        <DialogContent className="w-[90vw] sm:max-w-[425px] bg-white rounded-lg">
          <DialogHeader>
            <DialogTitle>Change Avatar</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="w-48 h-48">
                <AvatarFallback>{profile?.name.charAt(0)}</AvatarFallback>
                <AvatarImage alt="Avatar preview" src={profile?.avatar} />
              </Avatar>
              <Label htmlFor="avatar-upload" className="cursor-pointer">
                <div className="flex flex-col items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="relative overflow-hidden"
                  >
                    Upload New Avatar
                    <Input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="absolute opacity-0 w-full h-full cursor-pointer"
                      onChange={(e) => uploadAvatar(e)}
                    />
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    Auto update when you upload an image
                  </span>
                </div>
              </Label>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
