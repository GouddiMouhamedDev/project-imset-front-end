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
import { getOneProduitData, updateOneProduitData } from "@/api/produits"; // Assurez-vous d'importer les fonctions nécessaires depuis le bon chemin

export default function EditProduitForm({
  _id,
  onSubmitSuccess,
}: {
  _id: string | null;
  onSubmitSuccess: () => void;
}) {
  const [formData, setFormData] = useState<any>({});
  const [msg, setMsg] = useState<string>();

  const handleSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (
    formData
  ) => {
    try {
      const resp = await updateOneProduitData(_id, formData);
      console.log(resp);
      setMsg((resp as { data: { msg: string } }).data.msg);
      onSubmitSuccess();
      setTimeout(() => {
        setMsg(""); // Réinitialiser le message après 2 secondes
      }, 2000); // 2 secondes
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour des données du produit :",
        error
      );
    }
  };

  const fetchOneProduitData = async () => {
    if (_id) {
      try {
        const fetchedOneProduitData = await getOneProduitData(_id);
        setFormData(fetchedOneProduitData!.data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données du produit :",
          error
        );
      }
    }
  };

  const formSchema = z.object({
    nom: z.string({ required_error: "Nom requis." }).describe("Nom"),
    stock: z.number({ required_error: "Stock requis." }).int().positive().describe("Stock"),
    prixUnitaireHT: z.number({ required_error: "Prix unitaire HT requis." }).positive().describe("Prix unitaire HT"),
    tauxTVA: z.number({ required_error: "Taux TVA requis." }).positive().min(0).max(100).describe("Taux TVA"),
    prixUnitaireTTC: z.number({ required_error: "Prix unitaire TTC requis." }).positive().describe("Prix unitaire TTC"),
  
  });

  useEffect(() => {
    fetchOneProduitData();
  }, [_id]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-4 h-4 cursor-pointer hover:scale-[1.1]">
          <MdEdit />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier le produit</DialogTitle>
          <DialogDescription>
            Apportez des modifications au produit ici. Cliquez sur Enregistrer lorsque vous avez terminé.
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
