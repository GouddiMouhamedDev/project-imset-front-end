"use client"
import { useEffect, useState } from "react"


import Blueloading from "@/components/loading"
import { getOneVehiclesData } from "@/api/vehicles"
import { VehicleData } from "@/interface/vehicles"
import { VehiclesForm } from "@/components/vehiclesForm"



export default function EditUser({ params: { id } }: { params: { id: string } }){
  const [oneVehiclesData, setOneVehiclesData] = useState<VehicleData | undefined>(); 
  
  const fetchData = async () => {
      try {
          const data = await getOneVehiclesData(id);
          setOneVehiclesData(data);
      } catch (error) {
          console.error('Une erreur s\'est produite lors de la récupération des données :', error);
      } finally {
          
      }
  };
  useEffect(() => {
      fetchData();
  }, []);
  if (!oneVehiclesData) { 
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
          <VehiclesForm  data ={oneVehiclesData}/>
        </div>
      </div>
     
  )
}
