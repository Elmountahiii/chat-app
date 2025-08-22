import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PROFILE_PICTURES } from "@/types/utils";
import { Edit2 } from "lucide-react";
import Image from "next/image";

type Props = {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  selectedPicture: string;
  setSelectedPicture: (picture: string) => void;
};

function ProfileImagePicker({
  isDialogOpen,
  setIsDialogOpen,
  selectedPicture,
  setSelectedPicture,
}: Props) {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors">
          <Edit2 className="w-3 h-3" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose Profile Picture</DialogTitle>
          <DialogDescription>
            Select a profile picture from the options below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-5 gap-3 py-4">
          {PROFILE_PICTURES.map((picture, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedPicture(picture)}
              className={`relative w-12 h-12 rounded-full overflow-hidden border-2 transition-all hover:scale-105 ${
                selectedPicture === picture
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-border hover:border-primary/50"
              }`}>
              <Image
               width={64}
                height={64}
                src={picture}
                alt={`Profile option ${index + 1}`}
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProfileImagePicker;
