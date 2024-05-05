"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm, SubmitHandler } from "react-hook-form";
import { createVehicle, updateVehicle } from "@/api/vehicles";
import { VehicleData } from "@/types/vehicles";
import { useRouter } from 'next/navigation';

export function VehiclesForm({ data }: { data?: VehicleData }) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();
  const router= useRouter();
  const onSubmit: SubmitHandler<any> = async (formData) => {
    if (data) {
      try {
       const response= await updateVehicle(data._id, formData);
       console.log("response:",response);
       if (response?.status===200){
          router.push("/vehicles");
        }
      } catch (error) {
        console.error("Une erreur s'est produite lors de Update :", error);
      }
    } else {
      try {
        const response=  await createVehicle(formData);
        if (response?.status===200){
          router.push("/vehicles");
        }
      } catch (error) {
        console.error("Une erreur s'est produite lors de l'envoi des données :", error);
      }
    }
  };

  return (
    <div className={"grid gap-6"}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div>
            <label htmlFor="matriculeVehicule">Matricule</label>
            <Input
              {...register("matriculeVehicule")}
              
              name="matriculeVehicule"
              placeholder="9999 TU 200"
              type="text" 
              defaultValue={data ? data.matriculeVehicule : ""}
              disabled={isSubmitting}
            />
          </div>
    
    
          <Button type="submit"> {data ? "Modifier" : "Ajouter"}</Button>

        </div>
      </form>
    </div>
  );
}
