import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateOneVehicleData } from "@/api/vehicles";
import { MdEdit } from "react-icons/md";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function EditVehicleForm({
  vehicleId,
  onSubmitSuccess,
}: {
  vehicleId: string | null;
  onSubmitSuccess: () => void;
}) {
  const { register, handleSubmit, formState: { isSubmitting }, reset } = useForm();
  const [msg, setMsg] = useState<string | undefined>();

  const onSubmit: SubmitHandler<any> = async (formData) => {
    try {
      const response = await updateOneVehicleData(vehicleId, formData);
      setMsg((response as { data: { msg: string } }).data.msg);
      onSubmitSuccess();
      setTimeout(() => {
        setMsg("");
      }, 1500); // 1.5 seco // 2 secondes
    } catch (error) {
      console.error("Une erreur s'est produite lors de la mise à jour :", error);
    }
  };

  useEffect(() => {
    // Reset form when vehicleId changes
    reset();
  }, [vehicleId, reset]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <MdEdit className="w-4 h-4 cursor-pointer hover:scale-[1.1]" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier le véhicule</DialogTitle>
          <DialogDescription>
            Apportez des modifications au véhicule ici. Cliquez sur Enregistrer lorsque vous avez terminé.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right" htmlFor="matricule">Matricule</label>
              <Input
                {...register("matricule")}
                id="matricule"
                className="col-span-3"
                disabled={isSubmitting}
              />
            </div>
            {msg && <div className="text-xs pt-3">{msg}</div>}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>Enregistrer les modifications</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
