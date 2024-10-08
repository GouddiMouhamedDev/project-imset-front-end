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
import { getOneVehiclesData ,updateOneVehiclesData} from "@/api/vehicles";



export default function EditVehicleForm({
  vehicleId,
  onSubmitSuccess,
}: {
  vehicleId: string | null;
  onSubmitSuccess: () => void;
}) {
  const [formData, setFormData] = useState<any>({});
  const [msg,setMsg]=useState<string>();
  const handleSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (
    formData
  ) => {
    try {
      const resp = await updateOneVehiclesData(vehicleId, formData);
      setMsg((resp as { data: { msg: string } }).data.msg);
      onSubmitSuccess();
      setFormData(formData);
      setTimeout(() => {
        setMsg(""); // Réinitialiser le message après 2 secondes
      }, 1500); // 2 secondes
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour des données de l'utilisateur :",
        error
      );
    }
  };


  const fetchOneVehicleData = async () => {
    if (vehicleId) {
      try {
        const fetchedOneUserData = await getOneVehiclesData(vehicleId);
        setFormData(fetchedOneUserData)

      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données de l'utilisateur :",
          error
        );
      }
    }
  };

  const formSchema = z.object({
    Matricule: z.string({
      required_error: "Matricule requis.",
    }),
  });


  
  useEffect(() => {
    fetchOneVehicleData();
   
  }, [vehicleId]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-4 h-4 cursor-pointer hover:scale-[1.1]"> <MdEdit  /></div>
       
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier le profil</DialogTitle>
          <DialogDescription>
            Apportez des modifications au profil ici. Cliquez sur Enregistrer
            lorsque vous avez terminé
           
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



