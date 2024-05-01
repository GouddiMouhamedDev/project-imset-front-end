"use client"
import { UserForm} from "@/components/userForm"
import { useEffect, useState } from "react"
import { OneUserData } from "@/interface/users"
import { getOneUserData } from "@/api/users"
import Blueloading from "@/components/loading"



export default function EditUser({ params: { id } }: { params: { id: string } } ){
  const [oneUserData, setOneUserData] = useState<OneUserData | undefined>(); 
  
  const fetchData = async () => {
      try {
          const data = await getOneUserData(id);
          setOneUserData(data);
      } catch (error) {
          console.error('Une erreur s\'est produite lors de la récupération des données :', error);
      } 
          
      
  };
  useEffect(() => {
      fetchData();
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
              Edit
            </h1>
          </div>
          <UserForm customRoute="/users" data ={oneUserData} />
        </div>
      </div>
      
  )
}
