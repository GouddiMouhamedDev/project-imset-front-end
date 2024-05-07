"use client";
import React, { useState } from "react";
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
import { createVehicle } from "@/api/vehicles";
import { IoIosAddCircle } from "react-icons/io";



export default function AddVehicleForm({
    onSubmitSuccess,
  }: {
    onSubmitSuccess: () => void;
  }) {
  const [msg, setMsg] = useState<string>("");
  const handleSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (formData) => {
    try {
      const response = await createVehicle(formData);
      setMsg((response as { data: { msg: string } }).data.msg);
      onSubmitSuccess();
      setTimeout(() => {
        setMsg(""); // Clear message after 2 seconds
      }, 1500);
    } catch (error) {
      console.error("Error creating vehicle:", error);
    }
  };
  const formSchema = z.object({
    Matricule: z.string({
      required_error: "Matricule required.",
    }),
    // Add more fields as needed
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <IoIosAddCircle className="w-4 h-4 cursor-pointer hover:scale-[1.1]" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un véhicule</DialogTitle>
          <DialogDescription>
            Add new vehicle details here. Click Save when done.
          </DialogDescription>
        </DialogHeader>
        <AutoForm formSchema={formSchema} onSubmit={handleSubmit}>
          <div className="flex justify-between">
            <div>{msg}</div>
            <AutoFormSubmit>Enregistrer</AutoFormSubmit>
          </div>
        </AutoForm>
      </DialogContent>
    </Dialog>
  );
}
