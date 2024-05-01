"use client"
import React, { useEffect, useState } from 'react';

import { UsersData } from '@/interface/users';
import Blueloading from '@/components/loading';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/searchBar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {vehiclesBulkDelete, getVehiclesData } from '@/api/vehicles';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader,AlertDialogTitle, AlertDialogTrigger,} from "@/components/ui/alert-dialog";



export default function VehiclesListDelete() {
    const [vehiclesData, setVehiclesData] = useState<UsersData[]>([]);
    const [selectedVehiclesIds, setSelectedVehiclesIds] = useState<number[]>([]);
    const columnHeaders = Object.keys(vehiclesData && vehiclesData.length > 0 ? vehiclesData[0] : {});
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
    const handleCheckboxChange = (userId: number) => {
    if (selectedVehiclesIds.includes(userId)) {
        // Si l'ID de l'utilisateur est déjà dans la liste, le retirez
        setSelectedVehiclesIds(selectedVehiclesIds.filter(id => id !== userId));
    } else {
        // Sinon, l'ajoutez à la liste
        setSelectedVehiclesIds([...selectedVehiclesIds, userId]);
    }
};
const handleDeleteList = async (selectedVehiclesIds: any) => {
   const response= await vehiclesBulkDelete(selectedVehiclesIds);
    if(response?.status===200){
        window.location.reload();
    }
  
  };
  


    
    if (isLoading) {
        return (
           
                <Blueloading />
        
        );
    }

    return (
  



            <div className="bg-gray-100 min-h-screen p-4">
                <div className="border-b-2 border-slate-400 pb-4 mb-4 flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">Delete vehicles</h1>
                    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" 
        className="bg-slate-700 hover:bg-slate-800 text-white" 
        disabled={selectedVehiclesIds.length === 0}
        >Delete List</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
          <AlertDialogDescription>
          Cette action ne peut pas être annulée. Cela supprimera définitivement  vos données de nos serveurs.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction  onClick={() => handleDeleteList(selectedVehiclesIds)}>Continuer</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog> 

                </div>
                <SearchBar />
                <Table>
            <TableHeader>
                <TableRow>
                <TableHead>action</TableHead>
                    {columnHeaders.map((header) => (
                        <TableHead key={header}>{header}</TableHead>
                    ))}
                    
                </TableRow>
            </TableHeader>
            <TableBody>
                {vehiclesData && vehiclesData.length > 0 ? (
                    vehiclesData.map((row: any, rowIndex: number) => (
                        <TableRow key={rowIndex}>
            <TableCell>
        
<Checkbox
 checked={selectedVehiclesIds.includes(row.id) }
 onCheckedChange={() => handleCheckboxChange(row.id)}
/>
       
    </TableCell>

                            {columnHeaders.map((header, columnIndex) => (
                               
                                <TableCell key={columnIndex}>
                                     <Link href={`/users/${row.id}`}>
                                   
                                            {row[header] === null ? (
                                                <Badge className="bg-yellow-600">Null</Badge>
                                            ) : typeof row[header] === 'boolean' ? (
                                                <Badge className={`bg-${row[header] ? 'green' : 'red'}-600 hover`} variant="default">
                                                    {row[header] ? 'Active' : 'Inactive'}
                                                </Badge>
                                            ) : (
                                                <span>{row[header]}</span>
                                            )}
                                      
                                    </Link>
                                </TableCell>
                            ))}
                         
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={columnHeaders.length + 1}>Aucune donnée disponible</TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>

            </div>  



       
    );
}
