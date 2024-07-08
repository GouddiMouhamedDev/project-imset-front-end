import React, { useState, useEffect } from "react";
import { SubmitHandler } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AutoFormSubmit } from "@/components/ui/auto-form";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { createProduit, updateOneProduitData, getOneProduitData } from "@/api/produits";
import { MdEdit } from "react-icons/md";

export default function EditProduitForm({
  _id,
  onSubmitSuccess,
}: {
  _id: string | null;
  onSubmitSuccess: () => void;
}) {
  const [formData, setFormData] = useState<any>({});
  const [msg, setMsg] = useState<string>("");
  const [isHTActive, setIsHTActive] = useState<boolean>(false);
  const [isTVAEntered, setIsTVAEntered] = useState<boolean>(false);

  useEffect(() => {
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
    fetchOneProduitData();
  }, [_id]);

  const calculatePrices = (updatedFormData: any) => {
    if (updatedFormData.prixUnitaireHT && updatedFormData.tauxTVA && isTVAEntered && isHTActive && updatedFormData.tauxTVA !== 0) {
      const ttc = (updatedFormData.prixUnitaireHT * (1 + updatedFormData.tauxTVA / 100)).toFixed(3);
      updatedFormData.prixUnitaireTTC = parseFloat(ttc);
    } else if (updatedFormData.prixUnitaireHT && isHTActive && !isTVAEntered) {
      updatedFormData.prixUnitaireTTC = updatedFormData.prixUnitaireHT;
    }

    if (updatedFormData.prixUnitaireTTC && updatedFormData.tauxTVA && isTVAEntered && !isHTActive && updatedFormData.tauxTVA !== 0) {
      const ht = (updatedFormData.prixUnitaireTTC / (1 + updatedFormData.tauxTVA / 100)).toFixed(3);
      updatedFormData.prixUnitaireHT = parseFloat(ht);
    } else if (updatedFormData.prixUnitaireTTC && !isHTActive && !isTVAEntered) {
      updatedFormData.prixUnitaireHT = updatedFormData.prixUnitaireTTC;
    }

    setFormData(updatedFormData);
  };

  const formSchema = z.object({
    nom: z.string({ required_error: "Nom requis." }).describe("Nom"),
    stock: z.number({ required_error: "Stock requis." }).int().positive().describe("Stock"),
    prixUnitaireHT: z.number({ required_error: "Prix unitaire HT requis." }).positive().describe("Prix unitaire HT"),
    tauxTVA: z.number({ required_error: "Taux TVA requis." }).positive().min(0).max(100).describe("Taux TVA"),
    prixUnitaireTTC: z.number({ required_error: "Prix unitaire TTC requis." }).positive().describe("Prix unitaire TTC"),
  });
  
  const handleSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (formData) => {
    try {
      const resp = await updateOneProduitData(_id, formData);
      console.log(resp);
      setMsg((resp as { data: { msg: string } }).data.msg);
      onSubmitSuccess();
      setTimeout(() => {
        setMsg("");
      }, 2000);
    } catch (error) {
      console.error("Erreur lors de la mise à jour des données du produit :", error);
    }
  };

  const toggleSlider = () => {
    setIsHTActive(!isHTActive);
    calculatePrices(formData);
  };

  const handleTVAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tva = parseFloat(e.target.value);
    const updatedFormData = { ...formData, tauxTVA: tva };
    setFormData(updatedFormData);
    setIsTVAEntered(tva >= 0);
    calculatePrices(updatedFormData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: parseFloat(value) || value };
    setFormData(updatedFormData);
    calculatePrices(updatedFormData);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-4 h-4 cursor-pointer hover:scale-[1.1]">
          <MdEdit />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier un produit</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(formData);
          }}
        >
          <div className="grid gap-2">
            <div>
              <label htmlFor="nom">
                Nom <span className="text-red-500">*</span>
              </label>
              <Input
                id="nom"
                name="nom"
                type="text"
                onChange={handleInputChange}
                value={formData.nom || ""}
              />
            </div>
            <div>
              <label htmlFor="stock">Stock</label>
              <Input
                id="stock"
                name="stock"
                type="number"
                onChange={handleInputChange}
                value={formData.stock || ""}
              />
            </div>
            <div>
              <label htmlFor="prixUnitaireHT">
                Prix unitaire HT <span className="text-red-500">*</span>
              </label>
              <Input
                id="prixUnitaireHT"
                name="prixUnitaireHT"
                type="number"
                onChange={handleInputChange}
                value={formData.prixUnitaireHT || ""}
                disabled={!isHTActive || formData.tauxTVA === 0}
                className="appearance-none"
              />
            </div>
            <div>
              <label htmlFor="prixUnitaireTTC">
                Prix unitaire TTC <span className="text-red-500">*</span>
              </label>
              <Input
                id="prixUnitaireTTC"
                name="prixUnitaireTTC"
                type="number"
                onChange={handleInputChange}
                value={formData.prixUnitaireTTC || ""}
                disabled={isHTActive || formData.tauxTVA === 0}
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
              <div className={`absolute left-0 w-full h-full bg-gray-600 rounded-full p-1`}></div>
              <div
                className={`absolute top-0 left-0 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                  isHTActive ? "" : "translate-x-full"
                }`}
              ></div>
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
