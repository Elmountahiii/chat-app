import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PROFILE_PICTURES } from "@/types/utils";
import { Edit2, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
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
  const [customUrl, setCustomUrl] = useState("");
  const [activeTab, setActiveTab] = useState("presets");

  const handleCustomUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl.trim()) {
      setSelectedPicture(customUrl.trim());
      setIsDialogOpen(false);
    }
  };

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
            Select a preset avatar or use a custom image URL.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="presets" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="presets" className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Presets
            </TabsTrigger>
            <TabsTrigger value="custom" className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4" />
              Custom Link
            </TabsTrigger>
          </TabsList>

          <TabsContent value="presets" className="mt-0">
            <div className="grid grid-cols-5 gap-3 py-4">
              {PROFILE_PICTURES.map((picture, index) => (
                <button
                  key={picture} // Using picture URL as key since they are unique
                  type="button"
                  onClick={() => {
                    setSelectedPicture(picture);
                    setIsDialogOpen(false);
                  }}
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
          </TabsContent>

          <TabsContent value="custom" className="mt-0">
            <form onSubmit={handleCustomUrlSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Input
                  placeholder="https://example.com/avatar.png"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  type="url"
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Paste a direct link to an image (JPG, PNG, GIF)
                </p>
              </div>

              {customUrl && (
                <div className="flex justify-center p-4 bg-muted/30 rounded-lg border border-dashed">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-border bg-background">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={customUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = PROFILE_PICTURES[0];
                      }}
                    />
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={!customUrl.trim()}>
                Use Image
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default ProfileImagePicker;
