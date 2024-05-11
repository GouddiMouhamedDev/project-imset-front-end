"use client";
import { UserForm} from "@/components/userForm"
import { useEffect, useState } from "react"
import { OneUserData } from "@/types/user"
import { getOneUserData } from "@/api/users"
import Blueloading from "@/components/loading"
import { useRouter } from "next/navigation"
import { auth, getUserInfoFromStorage, removeStorage} from "@/api/auth"



export default function EditUser({ params: { id } }: { params: { id: string } } ){
  const [oneUserData, setOneUserData] = useState<OneUserData | undefined>(); 
  const router = useRouter();
  const userId = getUserInfoFromStorage()?._id
 
  
  
  const fetchDataAfterAuth = async () => {
    if (id === userId) {
      fetchData();
    } else {
      const isAuthenticated = auth(["admin", "super-admin"]);
      if (isAuthenticated) {
        fetchData(); // Exécutez fetchData si l'utilisateur est authentifié
      } else {
        removeStorage();
        router.push('/login');
      }
    }
  };



  const fetchData = async () => {
      try {
          const data = await getOneUserData(id);
          setOneUserData(data);
      } catch (error) {
          console.error('Une erreur s\'est produite lors de la récupération des données :', error);
      } 
          
      
  };
  useEffect(() => {
    fetchDataAfterAuth();
  }, []);
  
  if (!oneUserData) { 
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
          <UserForm customRoute="/users" data ={oneUserData} />
        </div>
      </div>
      
  )
}
