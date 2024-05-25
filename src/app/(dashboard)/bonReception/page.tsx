"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, removeStorage } from "@/api/auth";
import { getBonReceptionsData, deleteBonReceptionData } from "@/api/bonReception"; // Mise à jour de l'import
import BlueLoading from "@/components/loading";
import SearchBar from "@/components/searchBar";
import { MdDeleteForever, MdEdit } from "react-icons/md";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BonReceptionData } from "@/types/bonReception"; // Mise à jour de l'import
import { getOneClientData } from "@/api/clients";
import { getOneUserData } from "@/api/users";
import { IoIosAddCircle } from "react-icons/io";
import Link from "next/link";
import { getOneFournisseurData } from "@/api/fournisseurs";

export default function BonReceptions() { // Changement du nom de la fonction
  const [bonReceptionsData, setBonReceptionsData] = useState<any[]>([]); // Mise à jour de la variable
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const columnHeaders = Object.keys(bonReceptionsData && bonReceptionsData.length > 0 ? bonReceptionsData[0] : {}); // Mise à jour de la variable
  
  const fetchData = async () => {
    try {
      const isAuthenticated = auth(["admin", "super-admin", "user"]);
      if (!isAuthenticated) {
        removeStorage();
        router.push("/login");
      } else {
        const data: BonReceptionData[] = await getBonReceptionsData(); // Mise à jour de la fonction
        const formattedData = await Promise.all(data.map(async (bonReception) => {
          // Extraire la partie de la date sans l'heure
          const datePart = bonReception.dateReception.split("T")[0];
          
          // Récupérer le nom du vendeur en fonction de son ID
          const opérateurName = (await getOneUserData(bonReception.userId))?.name || "";
   
          return {  
            id: bonReception._id,
            idBon: bonReception.idBonReception,
            date: datePart,
            fournisseur: (await getOneFournisseurData(bonReception.fournisseur))?.data?.nom || "",
            opérateur: opérateurName,
            véhicule: bonReception.vehicle, // Nouveau champ pour le véhicule de livraison
            chauffeur: bonReception.chauffeur,// Nouveau champ pour le nom du chauffeur
            prixTotalHT: bonReception.prixTotalHT,
            montantTVA: bonReception.montantTVA,
            prixTotalTTC: bonReception.prixTotalTTC,
           
          };
        }));
        
        setBonReceptionsData(formattedData); // Mise à jour de la variable
      }
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de la récupération des données des bons de réception :",
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBonReceptionData(id); // Mise à jour de la fonction
      await fetchData();
    } catch (error) {
      console.error("Une erreur s'est produite lors de la suppression du bon de réception :", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return <BlueLoading />;
  }

  return (
    <div className="min-h-screen p-4">
      <div className="border-b-2 border-slate-400 pb-4 mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Liste des bons de réception</h1> {/* Mise à jour du texte */}
      </div>
      <SearchBar />
      <div className="rounded-md border mt-2">
        <Table>
          <TableHeader>
            <TableRow>
              {columnHeaders
              .filter((header)=>header!="id")
              .map((header) => (
                <TableHead key={header}>
                  {header}</TableHead>
              ))}
              <TableHead >
              <Link className="flex justify-center items-center " href={"/bonReception/add"}>{/* Mise à jour du lien */}
                  <IoIosAddCircle className=" w-4 h-4 cursor-pointer hover:scale-[1.2] " />
                </Link>
                </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bonReceptionsData && bonReceptionsData.length > 0 ? (
              bonReceptionsData.map((row:any, rowIndex:number) => (
                <TableRow key={rowIndex}>

                  {columnHeaders
                  .filter((header)=>header!="id")
                  .map((header, columnIndex) => (
                    <TableCell key={columnIndex}>
                      <span>{row[header]}</span>
                      </TableCell>
                  ))}
                  <TableCell className="flex place-content-center">
                    <div className="flex flex-row space-x-2">
                      {/** link to edit bon Livraison page */}
                      <Link href={`/bonReception/${row.Id}`}>{/* Mise à jour du lien */}
                      <div className="w-4 h-4 cursor-pointer hover:scale-[1.1]">
                      <MdEdit />
                      </div>
                        </Link>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <div className="w-4 h-4 cursor-pointer hover:scale-[1.1]">
                            <MdDeleteForever />
                          </div>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Cette action est irréversible.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(row.Id )}>
                              Continuer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
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
    </div>
  );
}
