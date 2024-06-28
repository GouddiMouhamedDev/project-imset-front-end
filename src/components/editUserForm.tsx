import React, { useEffect, useState } from "react";
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
import { getUserInfoFromStorage } from "@/api/auth";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";


export default function EditUserForm({
  userId,
  onSubmitSuccess,
}: {
  userId: string | null;
  onSubmitSuccess: () => void;
}) {
  const [formData, setFormData] = useState<any>({});
  const [msg, setMsg] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    fetchOneUserData();
  }, [userId]);

  const fetchOneUserData = async () => {
    if (userId) {
      try {
        const fetchedOneUserData = await getOneUserData(userId);
        setFormData({
          name: fetchedOneUserData.name,
          email: fetchedOneUserData.email,
          role: fetchedOneUserData.role,
        });

        setUserRole(getUserInfoFromStorage()?.role || "");
      } catch (error) {
        console.error("Erreur lors de la récupération des données de l'utilisateur :", error);
      }
    }
  };

  const handleSubmit: SubmitHandler<any> = async (formData) => {
    try {
      const resp = await updateOneUserData(userId, formData);
      setMsg((resp as { data: { msg: string } }).data.msg);
      onSubmitSuccess();
      setTimeout(() => {
        setMsg("");
      }, 1500);
    } catch (error) {
      console.error("Erreur lors de la mise à jour des données de l'utilisateur :", error);
    }
  };

  const validateForm = z.object({
    name: z.string().nonempty("Nom requis."),
    email: z.string().email("Adresse email invalide."),
    role: z.enum(["user", "admin"]).optional(),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRadioChange = (value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      role: value,
    }));
  };
  

  const isSuperAdmin = userRole === "super-admin";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-4 h-4 cursor-pointer hover:scale-[1.1]">
          <MdEdit />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier le profil</DialogTitle>
          <DialogDescription>
            Apportez des modifications au profil ici. Cliquez sur Enregistrer lorsque vous avez terminé
          </DialogDescription>
        </DialogHeader>
        <form  className=" space-y-2" onSubmit={(e) => { e.preventDefault(); handleSubmit(formData); }}>
          <div>
            <label>Nom:</label>
            <Input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <Input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              required
            />
          </div>
          {isSuperAdmin && (
            <div>
              <label>Rôle:</label>
              <RadioGroup
              
              defaultValue={formData.role || ""}
              onValueChange={(value) => handleRadioChange(value)}
>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="user" id="r1" />
    <label htmlFor="r1">Utilisateur</label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="admin" id="r2" />
    <label htmlFor="r2">Administrateur</label>
  </div>
</RadioGroup>

            </div>
          )}
          <div className="flex justify-between">
            <div>{msg}</div>
            <Button type="submit">Enregistrer</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
