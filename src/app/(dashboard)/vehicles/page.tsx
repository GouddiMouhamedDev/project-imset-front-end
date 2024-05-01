"use client"
import React, { useEffect, useState } from 'react';
import { getVehiclesData } from '@/api/vehicles';

import { UsersData } from '@/interface/users';
import Blueloading from '@/components/loading';
import MultiDataTable from '@/components/multiDataTable';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/searchBar';
import Link from 'next/link';



export default function Vehicles() {
    const [vehiclesData, setVehiclesData] = useState<UsersData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const fetchData = async () => {
        try {
            const data = await getVehiclesData();
            setVehiclesData(data);

        } catch (error) {
            console.error('Une erreur s\'est produite lors de la récupération des données :', error);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {


        fetchData();
    }, []);

    if (isLoading) {
        return (
           
                <Blueloading />
       
        );
    }

    return (
 



            <div className="bg-gray-100 min-h-screen p-4">
                <div className="border-b-2 border-slate-400 pb-4 mb-4 flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">Liste des utilisateurs</h1>
                    <Button className="bg-slate-700 hover:bg-slate-800 text-white">
                       <Link href={'/vehicles/add'}>Ajouter un Vehicule </Link> 
                    </Button>
                </div>
                <SearchBar />
                <MultiDataTable data={vehiclesData} To='vehicles' />

            </div>




    );
}
