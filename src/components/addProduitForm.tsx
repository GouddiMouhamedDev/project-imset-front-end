import React, { useState, useEffect } from "react";
import { IoIosAddCircle } from "react-icons/io";
import { SubmitHandler } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AutoFormSubmit } from "@/components/ui/auto-form";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { createProduit } from "@/api/produits";

export default function AddProduitForm({ onSubmitSuccess }: { onSubmitSuccess: () => void; }) {
  const [formData, setFormData] = useState<any>({});
  const [msg, setMsg] = useState<string>("");
  const [isHTActive, setIsHTActive] = useState<boolean>(false);
  const [isTVAEntered, setIsTVAEntered] = useState<boolean>(false);

  useEffect(() => {
    // Vérifie si les données nécessaires sont présentes pour calculer le prix unitaire TTC
    if (formData.prixUnitaireHT && formData.tauxTVA && isTVAEntered && isHTActive && formData.tauxTVA !== 0) {
      // Calcul du prix unitaire TTC
      const ttc = (formData.prixUnitaireHT * (1 + formData.tauxTVA / 100)).toFixed(3);
      // Met à jour formData avec le prix unitaire TTC calculé
      setFormData({ ...formData, prixUnitaireTTC: parseFloat(ttc) });
    } else if (formData.prixUnitaireHT && isHTActive && !isTVAEntered) {
      // Si aucune TVA n'est entrée, le prix unitaire TTC reste le même que le prix unitaire HT
      setFormData({ ...formData, prixUnitaireTTC: formData.prixUnitaireHT });
    }
    
    // Vérifie si les données nécessaires sont présentes pour calculer le prix unitaire HT
    if (formData.prixUnitaireTTC && formData.tauxTVA && isTVAEntered && !isHTActive && formData.tauxTVA !== 0) {
      // Calcul du prix unitaire HT
      const ht = (formData.prixUnitaireTTC / (1 + formData.tauxTVA / 100)).toFixed(3);
      // Met à jour formData avec le prix unitaire HT calculé
      setFormData({ ...formData, prixUnitaireHT: parseFloat(ht) });
    } else if (formData.prixUnitaireTTC && !isHTActive && !isTVAEntered) {
      // Si aucune TVA n'est entrée, le prix unitaire HT reste le même que le prix unitaire TTC
      setFormData({ ...formData, prixUnitaireHT: formData.prixUnitaireTTC });
    }
  }, [formData.prixUnitaireHT, formData.prixUnitaireTTC, formData.tauxTVA, isTVAEntered, isHTActive]);
  

  const handleSubmit: SubmitHandler<any> = async (e, formData) => {
    e.preventDefault();
    try {
      const response = await createProduit(formData);
      console.log("formData",formData)
      setMsg((response as { data: { msg: string } }).data.msg);
      onSubmitSuccess();
     if((response as { status: number } ).status===201){
      setFormData({});
      setIsHTActive(false); 
      setIsTVAEntered(false);
     }else{
      setIsHTActive(false); // Réinitialise l'état HT
      setFormData(formData);
     }
        
      
     
      setTimeout(() => {
        setMsg("");
      }, 1500);
    } catch (error) {
      console.error("Erreur lors de la création du produit :", error);
    }
  };

  const toggleSlider = () => {
    setIsHTActive(!isHTActive);
  };

  const handleTVAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tva = parseFloat(e.target.value);
    setFormData({ ...formData, tauxTVA: tva });
    setIsTVAEntered(tva >= 0); // Si tva est supérieur ou égal à 0, considérez-le comme entré
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-4 h-4 cursor-pointer hover:scale-[1.1]"> <IoIosAddCircle /></div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un produit</DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => handleSubmit(e, formData)}>
          <div className="grid gap-2">
            <div>
              <label htmlFor="nom">Nom <span className="text-red-500">*</span></label>
              <Input
                id="nom"
                name="nom"
                type="text"
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                value={formData.nom || ""}
              />
            </div>
            <div>
              <label htmlFor="stock">Stock</label>
              <Input
                id="stock"
                name="stock"
                type="number"
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                value={formData.stock || ""}
              />
            </div>
            <div>
              <label htmlFor="prixUnitaireHT">Prix unitaire HT <span className="text-red-500">*</span></label>
              <Input
                id="prixUnitaireHT"
                name="prixUnitaireHT"
                type="number"
                onChange={(e) => setFormData({ ...formData, prixUnitaireHT: parseFloat(e.target.value) })}
                value={formData.prixUnitaireHT || ""}
                disabled={!isHTActive || formData.tauxTVA === 0} // Désactive si HT est désactivé ou si la TVA est à 0
                className="appearance-none"
              />
            </div>
            <div>
              <label htmlFor="prixUnitaireTTC">Prix unitaire TTC <span className="text-red-500">*</span></label>
              <Input
                id="prixUnitaireTTC"
                name="prixUnitaireTTC"
                type="number"
                onChange={(e) => setFormData({ ...formData, prixUnitaireTTC: parseFloat(e.target.value) })}
                value={formData.prixUnitaireTTC || ""}
                disabled={isHTActive || formData.tauxTVA === 0} // Désactive si TTC est désactivé ou si la TVA est à 0
                className="appearance-none"
              />
            </div>
            <div>
              <label htmlFor="tauxTVA">Taux TVA</label>
              <Input
                id="tauxTVA"
                name="tauxTVA"
                type="number"
                onChange={handleTVAChange}
                value={formData.tauxTVA || ""}
              />
            </div>
          </div>
          <div className="flex flex-row space-x-4 p-4">
            <label htmlFor="toggleSlider">Prix unitaire HT</label>
            <div className="relative w-10 h-5 cursor-pointer" onClick={toggleSlider}>
              <div className={`absolute left-0 w-full h-full bg-gray-600 rounded-full p-1 `}></div>
              <div className={`absolute top-0 left-0 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isHTActive ? '' : 'translate-x-full'}`}></div>
            </div>
            <label htmlFor="toggleSlider">Prix unitaire TTC</label>
          </div>
          <div className="flex justify-between">
            <div>{msg}</div>
            <AutoFormSubmit>Enregistrer</AutoFormSubmit>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}