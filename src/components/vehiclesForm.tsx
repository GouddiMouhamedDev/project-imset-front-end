"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm, SubmitHandler } from "react-hook-form";
import { createVehicle, updateVehicleWithPut } from "@/api/vehicles";
import { VehicleData } from "@/interface/vehicles";
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
       const response= await updateVehicleWithPut(data.id, formData);
       if (response?.status===200){
          router.push("/vehicles");
        }
      } catch (error) {
        console.error("Une erreur s'est produite lors de Update :", error);
      }
    } else {
      try {
        const response=  await createVehicle(formData);
        console.log(response?.status) ;
        if (response?.status===201){
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
            <label htmlFor="vehicle_type">vehicle type</label>
            <Input
              {...register("vehicle_type")}
              id="vehicle_type"
              name="vehicle_type"
              placeholder="vehicle type"
              type="text" 
              defaultValue={data ? data.vehicle_type : ""}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="model">Model</label>
            <Input
              {...register("model")}
              id="model"
              name="model"
              placeholder="Model"
              type="text"
              defaultValue={data ? data.model : ""}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="registration_number">Registration Number</label>
            <Input
              {...register("registration_number")}
              id="registration_number"
              name="registration_number"
              placeholder="Registration Number"
              type="text"
              defaultValue={data ? data.registration_number : ""}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="phone">Assigned User</label>
            <Input
              {...register("assigned_user")}
              id="assigned_user"
              name="assigned_user"
              placeholder="Assigned User"
              type="number"
              defaultValue={data ? data.assigned_user : ""}
              disabled={isSubmitting}
            />
          </div>
    
          <Button type="submit"> {data ? "Edit" : "Add"}</Button>

        </div>
      </form>
    </div>
  );
}
