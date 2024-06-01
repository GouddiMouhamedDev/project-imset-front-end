"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, removeStorage } from "@/api/auth";
import { getBonLivraisonsData, deleteBonLivraisonData } from "@/api/bonLivraison";
import BlueLoading from "@/components/loading";
import SearchBar from "@/components/searchBar";
import { MdDeleteForever, MdEdit } from "react-icons/md";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BonLivraisonData } from "@/types/bonLivraison";
import { getOneClientData } from "@/api/clients";
import { getOneUserData } from "@/api/users";
import { IoIosAddCircle } from "react-icons/io";
import Link from "next/link";
import { LuFileSearch2 } from "react-icons/lu";
export default function BonLivraisons() {
  const [bonLivraisonsData, setBonLivraisonsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const columnHeaders = Object.keys(bonLivraisonsData && bonLivraisonsData.length > 0 ? bonLivraisonsData[0] : {});
  
  const fetchData = async () => {
    try {
      const isAuthenticated = auth(["admin", "super-admin", "user"]);
      if (!isAuthenticated) {
        removeStorage();
        router.push("/login");
      } else {
        const data: BonLivraisonData[] = await getBonLivraisonsData();
        const formattedData = await Promise.all(data.map(async (bonLivraison) => {
          // Extraire la partie de la date sans l'heure
          const datePart = bonLivraison.dateLivraison.split("T")[0];
          
          // Récupérer le nom du vendeur en fonction de son ID
          const vendeurName = (await getOneUserData(bonLivraison.userId))?.name || "";
   
          return {
            Id: bonLivraison._id,
            IdBon: bonLivraison.idBonLivraison,
            Date: datePart,
            NomClient: (await getOneClientData(bonLivraison.client))?.nom || "",
            destination: bonLivraison.destination,
            PrixTotalHT: bonLivraison.prixTotalHT,
            TVA: bonLivraison.montantTVA,
            prixTotalTTC: bonLivraison.prixTotalTTC,
            Vendeur: vendeurName,
            Véhicule: bonLivraison.vehicle, // Nouveau champ pour le véhicule de livraison
            Chauffeur: bonLivraison.chauffeur // Nouveau champ pour le nom du chauffeur
          };
        }));
        
        setBonLivraisonsData(formattedData);
      }
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de la récupération des données des bons de livraison :",
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBonLivraisonData(id);
      await fetchData();
    } catch (error) {
      console.error("Une erreur s'est produite lors de la suppression du bon de livraison :", error);
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
        <h1 className="text-2xl font-semibold">Liste des bons de livraison</h1>
      </div>
      <SearchBar />
      <div className="rounded-md border mt-2">
        <Table>
          <TableHeader>
            <TableRow>
              {columnHeaders
              .filter((header)=>header!="Id")
              .map((header) => (
                <TableHead key={header}>
                  {header}</TableHead>
              ))}
              <TableHead >
              <Link className="flex justify-center items-center " href={"/bonLivraison/add"}>
                  <IoIosAddCircle className=" w-4 h-4 cursor-pointer hover:scale-[1.2] " />
                </Link>
                </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bonLivraisonsData && bonLivraisonsData.length > 0 ? (
              bonLivraisonsData.map((row:any, rowIndex:number) => (
                <TableRow key={rowIndex}>

                  {columnHeaders
                  .filter((header)=>header!="Id")
                  .map((header, columnIndex) => (
                    <TableCell key={columnIndex}>
                      <span>{row[header]}</span>
                      </TableCell>
                  ))}
                  <TableCell className="flex place-content-center">
                    <div className="flex flex-row space-x-2">
                      {/* link to view bon Livraison page */}
                      <Link href={`/bonLivraison/view/${row.Id}`}>
                      <div className="w-4 h-4 cursor-pointer hover:scale-[1.1]">
                      <LuFileSearch2 />
                      </div>
                        </Link>
                      {/** link to edit bon Livraison page */}
                      <Link href={`/bonLivraison/${row.Id}`}>
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
