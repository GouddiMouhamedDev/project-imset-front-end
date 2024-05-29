"use client";
import { useEffect, useState } from "react"
import Blueloading from "@/components/loading"
import { useRouter } from "next/navigation"
import { auth, getUserInfoFromStorage, removeStorage} from "@/api/auth"
import { getSocieteData } from "@/api/societe";
import { SocieteForm } from "@/components/societeForm";



export default function EditSociete( ){ 
  const router = useRouter();
  const userId = getUserInfoFromStorage()?._id
  const [societeData, setSocieteData] = useState<any>();
  
  
  const fetchDataAfterAuth = async () => {
      const isAuthenticated = auth(["super-admin"]);
      if (isAuthenticated) {
        fetchData(); // Exécutez fetchData si l'utilisateur est authentifié
      } else {
        removeStorage();
        router.push('/login');
      }
    }
  



  const fetchData = async () => {
      try {
        const data = await getSocieteData();
        setSocieteData(data);
      } catch (error) {
          console.error('Une erreur s\'est produite lors de la récupération des données :', error);
      } 
          
      
  };
  useEffect(() => {
    fetchDataAfterAuth();
  }, []);
  
  if (!societeData) { 
    return (
        
            <Blueloading />
       
    );
}
  return (
   
      <div className="lg:p-8 relative">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
            Modifer
            </h1>
          </div>
          <SocieteForm  data ={societeData} />
        </div>
      </div>
      
  )
}
