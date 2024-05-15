"use client";
import { deleteOneUserData, getOneUserData } from "@/api/users";
import Blueloading from "@/components/loading";
import MonoDataTable from "@/components/monoDataTable";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, getUserInfoFromStorage, removeStorage } from "@/api/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function OneUser({
  params: { id },
}: {
  params: { id: string };
}) {
  const [oneUserData, setOneUserData] = useState<any>();
  const router = useRouter();
  const userId = getUserInfoFromStorage()?._id;

  const fetchDataAfterAuth = async () => {
    if (id === userId) {
      fetchData();
    } else {
      const isAuthenticated = auth(["admin", "super-admin"]);
      if (isAuthenticated || id === userId) {
        fetchData();
      } else {
        removeStorage();
        router.push("/login");
      }
    }
  };

  const fetchData = async () => {
    try {
      const data = await getOneUserData(id);
      const formattedData = {
        ID: data["_id"],
        Nom: data["name"],
        Email: data["email"],
        Rôle: data["role"],
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
      const response: any = await deleteOneUserData(id);
      if (response.status === 200) {
        router.push("/users");
      }
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de la suppression de l'utilisateur :",
        error
      );
    }
  };

  useEffect(() => {
    fetchDataAfterAuth();
  }, []);

  if (!oneUserData) {
    return <Blueloading />;
  }

  return (
    <div className=" p-8 rounded-lg shadow-md  justify-items-center h-full grid ">
      <div className=" flex-col p-2">
        <Avatar className="border-4 w-40 h-40 hover:opacity-75 ">
          <AvatarImage src="/img/Avatar-removebg-preview.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
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
