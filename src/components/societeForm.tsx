"use client";
import React, { useState, useEffect } from "react";
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import * as z from "zod";
import { updateSocieteData } from "@/api/societe";
import { useRouter } from 'next/navigation';
import { SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { Icons } from "./icons";

export function SocieteForm({

  data,
}: {
  data?: any;
}) {
  const [formData, setFormData] = useState<any>(data || {});
  const router = useRouter();
  const [isLoading, setIsLoading] =useState<boolean>(false);



  const formSchema = z.object({
    name: z.string({
      required_error: "Nom requis.",
    }).default(data ? formData.name : "")
    .describe("Nom"),
    activité: z.string({
      required_error: "Activité requise.",
    }).default(data ? formData.activité : "")
    .describe("Activité"),
    address: z.string({
      required_error: "Adresse requise.",
    }).default(data ? formData.address : "")
    .describe("Adresse"),
    Gsm: z.string({
      required_error: "GSM requis.",
    }).default(data ? formData.Gsm : ""),
    Tél: z.string({
      required_error: "Téléphone requis.",
    }).default(data ? formData.Tél : "")
    .describe("Téléphone"),
    RC: z.string({
      required_error: "Registre de commerce requis.",
    }).default(data ? formData.RC : "")
    .describe("Registre de commerce"),
    MF: z.string({
      required_error: "Matricule fiscal requis.",
    }).default(data ? formData.MF : "")
    .describe("Matricule fiscal"),
  });

  useEffect(() => {
    
    setFormData(data);
  }, [data]);

  const handleSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (formData) => {
    setIsLoading(true);
    try {
      const response = await updateSocieteData(formData);
      const msg = (response as { data: { msg: string } }).data.msg;
      if ((response as { status: number }).status === 200) {
        toast.success(msg, {
          position: "top-right",
          className: "text-white bg-green-500",
        });
        router.push("/societe");
      } else {
        toast.error(msg, {
          position: "top-right",
          className: "text-white bg-red-500",
        });
      }
    } catch (error) {
      console.error("Une erreur s'est produite lors de la mise à jour :", error);
    }
    setIsLoading(false);
  };

  return (
    <AutoForm
    formSchema={formSchema}
    onSubmit={handleSubmit}
    values={formData}
    className="flex flex-col  justify-center" 
  >
    <AutoFormSubmit 
      disabled={isLoading}
     >
      {isLoading ? (
        <>
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        </>
      ) : (
        "Éditer"
      )}
    </AutoFormSubmit>
  </AutoForm>
  
      
  
  );
}
