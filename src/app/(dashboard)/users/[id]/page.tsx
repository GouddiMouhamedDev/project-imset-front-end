"use client"
import { deleteOneUserData, getOneUserData } from "@/api/users";
import EditIcon from "@/components/editIcone";
import Blueloading from "@/components/loading";
import MonoDataTable from "@/components/monoDataTable";
import { OneUserData } from "@/interface/users";
import Image from "next/image";
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import { User } from "@/types/user";

export default function OneUser({ params: { id }}: {params: { id: string }}) {
  const [oneUserData, setOneUserData] = useState<any>();
  const router = useRouter();

  const fetchData = async () => {
    try {
      const data = await getOneUserData(id);
      const formattedData = {
        "ID": data["_id"],
        "Nom": data["name"],
        "Email": data["email"],
        "Rôle": data["role"],
      };
      
      setOneUserData(formattedData);
      
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de la récupération des données :",
        error
      );
    } finally {
    }
  };
  const handleDelete = async () => {
    try {
      const response: any=await deleteOneUserData(id);
      if(response){
        router.push("/users");
      }
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de la suppression de l'utilisateur :",
        error
      );
    }}
  useEffect(() => {
    fetchData();
  }, []);

  if (!oneUserData) {
    return <Blueloading />;
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md flex">
      <div className="w-1/3 mr-8">
        <Image
          src="/img/Avatar-removebg-preview.png"
          alt="Profile Image"
          width={300}
          height={300}
          quality={40}
          priority={false}
        />
        <br />
        <EditIcon />
      </div>

      <div className="w-2/3">
        <MonoDataTable
          data={oneUserData}
          tabeCaptionMsg="Informations de l'utilisateur"
          link={`/users/edit/${id}`}
          handleDelete={handleDelete}
        />
      </div>
    </div>
  );
}
