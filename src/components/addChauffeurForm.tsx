"use client"
import React, { useState } from "react";
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SubmitHandler } from "react-hook-form";
import { createChauffeur } from "@/api/chauffeurs"; // Assurez-vous d'importer la fonction createChauffeur depuis le bon chemin
import { IoIosAddCircle } from "react-icons/io";

export default function AddChauffeurForm({
  onSubmitSuccess,
}: {
  onSubmitSuccess: () => void;
}) {
  const [msg, setMsg] = useState<string>("");

  const handleSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (
    formData
  ) => {
    try {
      const response = await createChauffeur(formData);
      setMsg((response as { data: { msg: string } }).data.msg);
      onSubmitSuccess();
      setTimeout(() => {
        setMsg(""); // Clear message after 2 seconds
      }, 1500);
    } catch (error) {
      console.error("Error creating chauffeur:", error);
    }
  };

  const formSchema = z.object({
    name: z.string({
      required_error: "Nom required.",
    }),
    cin: z.coerce.number({
      invalid_type_error: "Le CIN doit être un nombre."
    }).refine(value => value.toString().length === 8, {
      message: "Le CIN doit être un nombre à 8 chiffres."
    })
    // Add more fields as needed
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-4 h-4 cursor-pointer hover:scale-[1.1]"> <IoIosAddCircle  /></div>
       
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un chauffeur</DialogTitle>
          <DialogDescription>
          Veuillez ajouter les détails du nouveau chauffeur ici.
           Cliquez sur Enregistrer lorsque vous avez terminé.
          </DialogDescription>
        </DialogHeader>
        <AutoForm formSchema={formSchema} onSubmit={handleSubmit}>
          <div className="flex justify-between">
            <div>{msg}</div>
            <AutoFormSubmit>Enregistrer</AutoFormSubmit>
          </div>
        </AutoForm>
      </DialogContent>
    </Dialog>
  );
}
