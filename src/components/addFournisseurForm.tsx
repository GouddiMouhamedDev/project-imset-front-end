import React, { useState, useEffect } from "react";
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
import { createFournisseur } from "@/api/fournisseurs"; // Assurez-vous d'importer la fonction appropriée pour créer un fournisseur
import { IoIosAddCircle } from "react-icons/io";

export default function AddFournisseurForm({
  onSubmitSuccess,
}: {
  onSubmitSuccess: () => void;
}) {
  const [formData, setFormData] = useState<any>({});
  const [msg, setMsg] = useState<string>("");

  const handleSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (
    formData
  ) => {
    try {
      const response = await createFournisseur(formData); // Utilisez la fonction pour créer un fournisseur
      setMsg((response as { data: { msg: string } }).data.msg);
      onSubmitSuccess();
      setFormData({});
      setTimeout(() => {
        setMsg(""); // Effacer le message après 1.5 secondes
      }, 1500);
    } catch (error) {
      console.error("Erreur lors de la création du fournisseur :", error);
    }
  };

  const formSchema = z.object({
    nom: z.string({
      required_error: "Nom requis.",
    }).describe("Nom"),
    telephone: z.string({
      required_error: "Téléphone requis.",
    }).describe("Telephone")
    .optional(),
    identifiantFiscaleFournisseur: z.string({
      required_error: "Identifiant fiscal requis.",
    }).describe("Identifiant Fiscale"),
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-4 h-4 cursor-pointer hover:scale-[1.1]">  <IoIosAddCircle  /></div>
      
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un fournisseur</DialogTitle>
          <DialogDescription>
            Ajoutez les détails du nouveau fournisseur ici. Cliquez sur Enregistrer lorsque vous avez terminé.
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
