"use client"

import { deleteVehicle, getOneVehiclesData } from "@/api/vehicles";
import Blueloading from "@/components/loading";
import MonoDataTable from "@/components/monoDataTable";
import { VehicleData, VehicleFormatedData } from "@/types/vehicles";


import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"


export default function Vehicle({ params: { id } }: { params: { id: string } }) {
    const [oneVehicleData, setOneVehicleData] = useState<any>();
    const router = useRouter();
    const fetchData = async () => {
        try {
            const data = await getOneVehiclesData(id);
            const formattedData = {
                "ID": data["_id"],
                "matricule": data["matriculeVehicule"],
              };
            setOneVehicleData(formattedData);
        } catch (error) {
            console.error('Une erreur s\'est produite lors de la récupération des données :', error);
        } finally {

        }
    };
    const handleDelete = async () => {
        const response = await deleteVehicle(id);

        if (response?.status === 204) {
            router.push("/vehicles");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (!oneVehicleData) {
        return (
         
                <Blueloading />
            
        );
    }

    return (
       
            <div className="p-8 rounded-lg shadow-md  justify-items-center items-center h-full grid ">


                <MonoDataTable data={oneVehicleData} tabeCaptionMsg="Informations de Vehicle" link={`/vehicles/edit/${id}`} handleDelete={handleDelete} />
            </div>

     
    )
}
