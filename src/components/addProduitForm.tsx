
import React, { useState } from "react";
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SubmitHandler } from "react-hook-form";
import { createProduit } from "@/api/produits"; // Assurez-vous d'importer la fonction appropriée pour créer un produit
import { IoIosAddCircle } from "react-icons/io";

export default function AddProduitForm({ onSubmitSuccess }: { onSubmitSuccess: () => void; }) {
  const [formData, setFormData] = useState<any>({});
  const [msg, setMsg] = useState<string>("");

  const handleSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (formData) => {
    try {
      const response = await createProduit(formData); // Utilisez la fonction pour créer un produit
      setMsg((response as { data: { msg: string } }).data.msg);
      onSubmitSuccess();
      setFormData({});
      setTimeout(() => {
        setMsg(""); // Effacer le message après 1.5 secondes
      }, 1500);
    } catch (error) {
      console.error("Erreur lors de la création du produit :", error);
    }
  };

  const formSchema = z.object({
    nom: z.string({ required_error: "Nom requis." }).describe("Nom"),
    stock: z.number({ required_error: "Stock requis." }).int().positive().describe("Stock"),
    prixUnitaireHT: z.number({ required_error: "Prix unitaire HT requis." }).positive().describe("Prix unitaire HT"),
    tauxTVA: z.number({ required_error: "Taux TVA requis." }).positive().min(0).max(100).describe("Taux TVA"),
    prixUnitaireTTC: z.number({ required_error: "Prix unitaire TTC requis." }).positive().describe("Prix unitaire TTC"),
   
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-4 h-4 cursor-pointer hover:scale-[1.1]">  <IoIosAddCircle /></div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un produit</DialogTitle>
        </DialogHeader>
        <AutoForm formSchema={formSchema} onSubmit={handleSubmit} values={formData}>
          <div className="flex justify-between">
            <div>{msg}</div>
            <AutoFormSubmit>Enregistrer</AutoFormSubmit>
          </div>
        </AutoForm>
      </DialogContent>
    </Dialog>
  );
}
