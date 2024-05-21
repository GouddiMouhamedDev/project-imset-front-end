"use client";
import React, { useEffect, useState } from "react";
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
import { MdEdit } from "react-icons/md";
import { SubmitHandler } from "react-hook-form";
import { getOneChauffeurData, updateOneChauffeurData } from "@/api/chauffeurs"; // Assurez-vous d'importer les fonctions nécessaires depuis le bon chemin

export default function EditChauffeurForm({
  chauffeurId,
  onSubmitSuccess,
}: {
  chauffeurId: string | null;
  onSubmitSuccess: () => void;
}) {
  const [formData, setFormData] = useState<any>({});
  const [msg, setMsg] = useState<string>();

  const handleSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (
    formData
  ) => {
    try {
      const resp = await updateOneChauffeurData(chauffeurId, formData);
      console.log(resp);
      setMsg((resp as { data: { msg: string } }).data.msg);
      onSubmitSuccess();
      setTimeout(() => {
        setMsg(""); // Réinitialiser le message après 2 secondes
      }, 1500); // 2 secondes
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour des données du chauffeur :",
        error
      );
    }
  };

  const fetchOneChauffeurData = async () => {
    if (chauffeurId) {
      try {
        const fetchedOneChauffeurData = await getOneChauffeurData(chauffeurId);
        console.log("fetchedOneChauffeurData",fetchedOneChauffeurData);
        setFormData(fetchedOneChauffeurData);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données du chauffeur :",
          error
        );
      }
    }
  };

  const formSchema = z.object({
    name: z.string({
      required_error: "Nom requis.",
    }),
    cin: z.coerce.number({
      invalid_type_error: "Le CIN doit être un nombre."
    }).refine(value => value.toString().length === 8, {
      message: "Le CIN doit être un nombre à 8 chiffres."
    })
   
  
   
    // Ajoutez d'autres champs au besoin
  });

  useEffect(() => {
    fetchOneChauffeurData();
  }, [chauffeurId]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-4 h-4 cursor-pointer hover:scale-[1.1]">
        <MdEdit  />
        </div>
       
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier le chauffeur</DialogTitle>
          <DialogDescription>
            Apportez des modifications au chauffeur ici. Cliquez sur Enregistrer lorsque vous avez terminé.
          </DialogDescription>
        </DialogHeader>
        <AutoForm
          formSchema={formSchema}
          onSubmit={handleSubmit}
          values={formData}
        >
          <div className="flex justify-between">
            <div>{msg}</div>
            <AutoFormSubmit>Enregistrer</AutoFormSubmit>
          </div>
        </AutoForm>
      </DialogContent>
    </Dialog>
  );
}
