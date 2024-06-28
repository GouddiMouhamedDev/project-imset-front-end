"use client";
import React, { useEffect, useState } from "react";
import {
  deleteOneProduitData,
  getProduitsData,
} from "@/api/produits";
import Blueloading from "@/components/loading";
import SearchBar from "@/components/searchBar";
import { useRouter } from "next/navigation";
import { auth, getUserInfoFromStorage, removeStorage } from "@/api/auth";
import { ProduitData, ProduitFormatData } from "@/types/produits";
import { MdDeleteForever } from "react-icons/md";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import EditProduitForm from "@/components/editProduitForm";
import AddProduitForm from "@/components/addProduitForm";
import { Card } from "@/components/ui/card";

export default function Produits() {
  const [produitsData, setProduitsData] = useState<any[]>([]);
  const userRole = getUserInfoFromStorage()?.role;
  const isAdmin = ["super-admin", "admin"].includes(userRole!);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const columnHeaders = Object.keys(produitsData && produitsData.length > 0 ? produitsData[0] : {});

  const fetchData = async () => {
    try {
      const isAuthenticated = auth(["admin", "super-admin","user"]);
      if (!isAuthenticated) {
        removeStorage();
        router.push("/login");
      } else {
        const data: any = await getProduitsData();
        const formattedData:ProduitData [] = data.map((produit:any) => ({
          _id:produit._id,
          idProduit: produit.idProduit,
          nom: produit.nom,
          stock: produit.stock,
          prixUnitaireHT: produit.prixUnitaireHT,
          tauxTVA: produit.tauxTVA,
          prixUnitaireTTC: produit.prixUnitaireTTC,
          
        }));
        setProduitsData(formattedData);
      }
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de la récupération des données des produits :",
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditFormSubmit = () => {
    fetchData();
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteOneProduitData(id);
      await fetchData();
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de la suppression du produit :",
        error
      );
    }
  };

  const handleEditSuccess = () => {
    fetchData();
  };

  useEffect(() => {
    (async () => {
      const fetchDataAfterAuth = async () => {
        const isAuthenticated = auth(["admin", "super-admin", "user"]);
        if (isAuthenticated) {
          fetchData();
        } else {
          removeStorage();
          router.push("/login");
        }
      };
  
      await fetchDataAfterAuth();
    })();
  }, []);
  

  if (isLoading) {
    return <Blueloading />;
  }

  return (
    
    <div className="min-h-screen p-4">
      
      <div className="border-b-2 border-slate-400 pb-4 mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Liste des produits</h1>
      </div>
      <SearchBar />
      <div className="rounded-md border mt-2">
        <Table>
      
          <TableHeader>
            <TableRow>
              {columnHeaders
                .filter((header) => header !== "_id")
                .map((header) => (
                  <TableHead key={header}>
                    {header === "IdProduit" ? "ID Produit" : header}
                  </TableHead>
                ))}
                 {isAdmin && (
              <TableHead className="flex justify-center pt-3">
                <AddProduitForm onSubmitSuccess={handleEditSuccess} />
              </TableHead>
                 )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {produitsData && produitsData.length > 0 ? (
              produitsData.map((row: any, rowIndex: number) => (
                <TableRow key={rowIndex}>
                  {columnHeaders
                    .filter((header) => header !== "_id")
                    .map((header, columnIndex) => (
                      <TableCell key={columnIndex}>
                        <span>{row[header]}</span>
                      </TableCell>
                    ))}
                     {isAdmin && (
                  <TableCell className="flex place-content-center">
                    <div className="flex flex-row space-x-2">
                      <EditProduitForm _id={row._id} onSubmitSuccess={handleEditFormSubmit} />                     
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <div className="w-4 h-4 cursor-pointer hover:scale-[1.1]">
                              <MdDeleteForever />
                            </div>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Êtes-vous absolument sûr ?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Cette action ne peut pas être annulée.
                                Cela supprimera définitivement vos données.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(row._id)}>
                                Continuer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                    
                    </div>
                  </TableCell>
                    )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columnHeaders.length}>
                  Aucune donnée disponible
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          
        </Table>
      </div>
    </div>

  );
}
