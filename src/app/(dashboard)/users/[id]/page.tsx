
"use client";
import { getOneUserData, updateOneUserData } from "@/api/users";
import Blueloading from "@/components/loading";
import MonoDataTable from "@/components/monoDataTable";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, getUserInfoFromStorage, removeStorage } from "@/api/auth";
import AvatarUploader from "@/components/avatarUploader";

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
      const isAuthenticated = auth(["super-admin"]);
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
        Avatar: data["avatar"] || "/img/Avatar-removebg-preview.png",
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

  const handleImageSave = async (image: string) => {
    try {
      const updatedData = { avatar: image };
      const response = await updateOneUserData(id, updatedData);
      if ((response as { status: number }).status === 200) {
        setOneUserData((prevData: any) => ({
          ...prevData,
          Avatar: image,
        }));
      }
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de la mise à jour de l'avatar :",
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

  // Exclure l'avatar des données envoyées à MonoDataTable
  const { Avatar, ...dataWithoutAvatar } = oneUserData;
  return (
    <div className=" p-8 rounded-lg shadow-md  justify-items-center h-full grid ">
      <div className=" flex-col p-2">
        <AvatarUploader
          initialImage={oneUserData.Avatar}
          onImageSave={handleImageSave}
        />
      </div>

      <div className="w-2/3">
        <MonoDataTable
          data={dataWithoutAvatar}
          tabeCaptionMsg="Informations de l'utilisateur"
          link={`/users/edit/${id}`}
        />
      </div>
    </div>
  );
}
