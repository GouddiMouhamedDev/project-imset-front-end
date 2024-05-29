"use client";

import Blueloading from "@/components/loading";
import MonoDataTable from "@/components/monoDataTable";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth,removeStorage } from "@/api/auth";
import { getSocieteData } from "@/api/societe";


export default function Societe() {
    const [societeData, setSocieteData] = useState<any>();
    const router = useRouter();
    const fetchDataAfterAuth = async () => {
        const isAuthenticated = auth(["super-admin"]);
        if (isAuthenticated) {
          fetchData();
        } else {
          removeStorage();
          router.push("/login");
        }
      } 
    
  
    const fetchData = async () => {
      try {
        const data = await getSocieteData();
        const formattedData = {
          Nom: data["name"],
          Address: data["address"],
          Télephone: data["Tél"],
          RC: data["RC"] ,
          MF: data["MF"] ,
        };
  
        setSocieteData(formattedData);
      } catch (error) {
        console.error(
          "Une erreur s'est produite lors de la récupération des données :",
          error
        );
      } 
    };
  
 
  
    useEffect(() => {
        fetchDataAfterAuth();
    }, []);
  
    if (!societeData) {
      return <Blueloading />;
    }
  
    // Exclure l'avatar des données envoyées à MonoDataTable
    return (
      <div className=" p-8 rounded-lg shadow-md  justify-items-center h-full grid ">
    
  
        <div className="w-2/3">
          <MonoDataTable
            data={societeData}
            tabeCaptionMsg="Informations de Société"
            link={`/societe/edit`}
          />
        </div>
      </div>
    );
  }