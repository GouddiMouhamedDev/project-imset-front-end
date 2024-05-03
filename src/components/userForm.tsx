
"use client"
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { postOneUserData, updateOneUserData } from "@/api/users";
import { useForm, SubmitHandler, } from "react-hook-form";
import { useRouter } from 'next/navigation';
import {AlertDialog,AlertDialogAction,AlertDialogCancel,AlertDialogContent,
  AlertDialogDescription,AlertDialogFooter,AlertDialogHeader,AlertDialogTitle,
  AlertDialogTrigger,} from "@/components/ui/alert-dialog"




export function UserForm({ customRoute,data }: { customRoute:string , data?:any}) {
  const {register, handleSubmit,formState: { isSubmitting }} = useForm();
  const router= useRouter();
  const [msg, setMsg] = React.useState<string>("");
  const [msgTitle, setMsgTitle] = React.useState<string>("");








  const onSubmit: SubmitHandler<any> = async (formData) => {
    if (data) {
      try {
        const response:any = await updateOneUserData(data._id, formData);
         if (response?.status===200){
          setMsgTitle("Mise à jour réussie");
           setMsg(response.data.msg);
          setTimeout(() => {
            router.push(customRoute);
          }, 2000); 
         }
        else{
          setMsgTitle("Échec de la mise à jour");
          setMsg(response?.data.msg);
        }
        
        
      } catch (error) {
        console.error("Une erreur s'est produite lors de Update :", error);
      }
    } else {
      try {
        const response:any = await postOneUserData(formData);
        if (response?.status===200){
          setMsgTitle("Enregistrement réussie");
          setMsg(response.data.msg);
          setTimeout(() => {
          router.push(customRoute);
        }, 2000); 
        }
        else{
          setMsgTitle("Échec de l'enregistrement");
          setMsg(response?.data.msg);
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
            <label htmlFor="name">Nom</label>
            <Input
              {...register("name")}
              id="name"
              name="name"
              placeholder="Nom"
              type="text"
              defaultValue={data ? data.name : ""}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <Input
              {...register("email")}
              id="email"
              name="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              defaultValue={data ? data.email : ""}
              disabled={isSubmitting}
              
            />
          </div>
       

          
          <div>
          <label htmlFor="password">Password</label>
          <Input
            {...register("password")}
            id="password"
            name="password"
            placeholder="Password"
            type="password"
            disabled={isSubmitting}
            autoComplete="current-password" 
          />
        </div>
        
        

<AlertDialog>
          <AlertDialogTrigger asChild>
          <Button type="submit"> {data ? "Éditer" : "S'inscrire"}</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
          <AlertDialogHeader>
          <AlertDialogTitle> {msgTitle} </AlertDialogTitle>
          <AlertDialogDescription>
          {msg}
          </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
          {(msgTitle === "Échec de l'enregistrement" || msgTitle === "Échec de la mise à jour") && (
  <AlertDialogCancel>réessayer</AlertDialogCancel>
)}

          </AlertDialogFooter>
          </AlertDialogContent>
          </AlertDialog> 

         

        </div>
      </form>
    </div>
  );
}




{/*<div className="flex items-center">
  <label>Rôle</label>
  <input
    {...register("role")}
    type="radio"
    id="admin"
    name="role"
    value="admin"
    className="ml-2 form-radio text-blue-500"
    defaultChecked={data?.role === "admin"}
    disabled={isSubmitting}
  />
  <label htmlFor="admin" className="ml-1">
    Admin
  </label>

  <input
    {...register("role")}
    type="radio"
    id="employee"
    name="role"
    value="employee"
    className="ml-4 form-radio text-blue-500"
    defaultChecked={data?.role === "employee"}
    disabled={isSubmitting}
  />
  <label htmlFor="employee" className="ml-1">
    Employee
  </label>
  <input
    {...register("role")}
    type="radio"
    id="conducteur"
    name="role"
    value="conducteur"
    className="ml-4 form-radio text-blue-500"
    defaultChecked={data?.role === "conducteur"}
    disabled={isSubmitting}
  />
  <label htmlFor="conducteur" className="ml-1">
    Conducteur
  </label>
</div>

<Button
  onClick={() => document.getElementById("image")?.click()}
  variant="secondary"
  size="sm"
  disabled={isSubmitting}
>
  <UploadIcon className="h-4 w-4" />
  Ajouter une image (dev)
</Button>*/}
