"use client";
import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import dynamic from "next/dynamic";
import { useUser } from "@/contexts/UserContext"; // Importer le contexte utilisateur

const AvatarEditor = dynamic(() => import("react-avatar-edit"), { ssr: false });

export default function AvatarUploader({
  initialImage,
  onImageSave,
}: {
  initialImage?: string;
  onImageSave: (image: string) => void;
}) {
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(initialImage || null);
  const [preview, setPreview] = useState<string | null>(null);
  const [editorOpen, setEditorOpen] = useState<boolean>(false);
  const [editorKey, setEditorKey] = useState<number>(0);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const { user, setUser } = useUser(); // Utiliser le contexte utilisateur

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleFileChange = (file: File) => {
    if (file && file.type.substring(0, 5) === "image") {
      setImage(file);
      const newImageUrl = URL.createObjectURL(file);
      setImageUrl(newImageUrl);
      setPreview(null);
      setEditorKey((prevKey) => prevKey + 1);
      setEditorOpen(true);
    } else {
      setImage(null);
      setImageUrl(null);
    }
  };

  const handleOpenFile = () => {
    document.getElementById("fileInput")?.click();
  };

  const handleCrop = (preview: string) => {
    setPreview(preview);
  };

  const handleCloseEditor = () => {
    setEditorOpen(false);
  };

  const handleSave = () => {
    if (preview) {
      onImageSave(preview);
      // Mettre à jour l'avatar de l'utilisateur dans le contexte
      setUser((prevUser) => (prevUser ? { ...prevUser, avatar: preview } : null));
      handleCloseEditor();
    }
  };

  if (!isMounted) return null;

  return (
    <div>
      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogTrigger asChild>
          <div style={{ cursor: "pointer" }}>
            <Avatar className="border-4 w-40 h-40 hover:opacity-75">
              {preview || initialImage ? (
                <AvatarImage src={preview || initialImage} alt="User avatar" />
              ) : (
                <AvatarFallback>U</AvatarFallback>
              )}
            </Avatar>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-screen-md">
          <DialogHeader>
            <DialogTitle>Recadrez votre image</DialogTitle>
            <DialogDescription>
            Sélectionnez la zone de l&apos;image que vous souhaitez afficher dans votre avatar.
            </DialogDescription>
          </DialogHeader>
          {imageUrl && (
            <div className="flex justify-center" key={editorKey}>
              <AvatarEditor
                width={390}
                height={295}
                onCrop={handleCrop}
                onClose={handleCloseEditor}
                src={imageUrl}
                closeIconColor="transparent"
              />
            </div>
          )}
          <DialogFooter className="sm:justify-start">
            <Button type="button" variant="secondary" onClick={handleOpenFile}>
              Choisir une nouvelle image
            </Button>
            <DialogClose asChild>
              <Button type="button" onClick={handleSave}>
                Enregistrer
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <input
        id="fileInput"
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) handleFileChange(file);
        }}
      />
    </div>
  );
}
