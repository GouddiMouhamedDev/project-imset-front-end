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
import { getOneClientData, updateOneClientData } from "@/api/clients";
import { SubmitHandler } from "react-hook-form";




export default function EditClientForm({
  clientId,
  onSubmitSuccess,
}: {
  clientId: string | null;
  onSubmitSuccess: () => void;
}) {
  const [formData, setFormData] = useState<any>();
  const [msg, setMsg] = useState<string>();

  const handleSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (
    formData
  ) => {
    try {
      const response = await updateOneClientData(clientId, formData);
      setMsg((response as { data: { msg: string } }).data.msg);
      onSubmitSuccess();
      setFormData(formData);
      setTimeout(() => {
        setMsg(""); // Réinitialiser le message après 1.5 secondes
      }, 1500);
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    }
  };

  const fetchOneClientData = async () => {
    if (clientId) {
      try {
     
        const fetchedOneClientData = await getOneClientData(clientId);
     
          setFormData(fetchedOneClientData!.data);
        
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données de l'utilisateur :",
          error
        );
      }
    }
  };

  const formSchema = z.object({
    nom: z.string({
      required_error: "Nom requis.",
    }),
    telephone: z.string({
      required_error: "Téléphone requis.",
      
    }).optional(),
    identifiantFiscaleClient: z.string({
      required_error: "Identifiant fiscal requis.",
    }).describe("Identifiant Fiscale"),
    destination: z.string({
      required_error: "Destination requise.",
    })
    
  });

  useEffect(() => {
    fetchOneClientData();
  }, [clientId]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-4 h-4 cursor-pointer hover:scale-[1.1]" >
        <MdEdit />
        </div>
       
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier le client</DialogTitle>
          <DialogDescription>
            Apportez des modifications au client ici. Cliquez sur Enregistrer lorsque vous avez terminé.
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
