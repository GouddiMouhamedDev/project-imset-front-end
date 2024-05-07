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
import { getOneUserData, updateOneUserData } from "@/api/users";
import { SubmitHandler } from "react-hook-form";

export default function EditUserForm({
  userId,
  onSubmitSuccess,
}: {
  userId: string | null;
  onSubmitSuccess: () => void;
}) {
  const [formData, setFormData] = useState<any>({});
  const [msg,setMsg]=useState<string>();
  
  const handleSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (
    formData
  ) => {
    try {
      const resp = await updateOneUserData(userId, formData);
      setMsg((resp as { data: { msg: string } }).data.msg);
      onSubmitSuccess();
      setFormData(formData)
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


  const fetchOneUserData = async () => {
    if (userId) {
      try {
        const fetchedOneUserData = await getOneUserData(userId);
        setFormData({
          name: fetchedOneUserData.name,
          email: fetchedOneUserData.email,
          role: fetchedOneUserData.role,
        });
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données de l'utilisateur :",
          error
        );
      }
    }
  };

  const formSchema = z.object({
    name: z.string({
      required_error: "Nom requis.",
    })
    .describe("Nom"),
    email: z
      .string({
        required_error: "Email requis.",
      })
      
      .email({
        message: "Adresse email invalide.",
      }),
    role: z.enum(["user", "admin"])
    .describe("Rôle"),
  });


  
  useEffect(() => {
    fetchOneUserData();
   
  }, [userId]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <MdEdit className="w-4 h-4 cursor-pointer hover:scale-[1.1]" />
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
          fieldConfig={{
            role: {
              fieldType: "radio",
              inputProps: {
                className: "flex flex-row",
              },
            },
          }}
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

