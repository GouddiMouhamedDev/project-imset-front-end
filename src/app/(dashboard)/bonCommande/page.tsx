"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, removeStorage } from "@/api/auth";
import { getBonCommandesData, deleteBonCommandeData } from "@/api/bonCommandes";
import BlueLoading from "@/components/loading";
import SearchBar from "@/components/searchBar";
import { MdDeleteForever, MdEdit } from "react-icons/md";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BonCommandeData, BonCommandeFormatData } from "@/types/bonCommande";
import { getOneClientData } from "@/api/clients";
import { getOneUserName } from "@/api/users";
import { IoIosAddCircle } from "react-icons/io";
import Link from "next/link";
import { LuFileSearch2 } from "react-icons/lu";

export default function BonCommandes() {
  const [bonCommandesData, setBonCommandesData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const columnHeaders = Object.keys(bonCommandesData && bonCommandesData.length > 0 ? bonCommandesData[0] : {});
  
  
  const fetchData = async () => {
    try {
      const isAuthenticated = auth(["admin","super-admin","user"]);
      if (!isAuthenticated) {
        removeStorage();
        router.push("/login");
      } else {
        const data: BonCommandeData[] = await getBonCommandesData();
        const formattedData = await Promise.all(data.map(async (bonCommande) => {
          // Extraire la partie de la date sans l'heure
          const datePart = bonCommande.dateCommande.split("T")[0];
          
          // Récupérer le nom du vendeur en fonction de son ID
        
          const vendeurName = await getOneUserName(bonCommande.userId);
   
          return {
            Id: bonCommande._id,
            IdBon: bonCommande.idBonCommande,
            Date: datePart,
            NomClient: (await getOneClientData(bonCommande.client))?.nom || "",
            destination: bonCommande.destination,
            PrixTotalHT: bonCommande.prixTotalHT,
            TVA: bonCommande.montantTVA,
            prixTotalTTC: bonCommande.prixTotalTTC,
            Vendeur: vendeurName
          };
        }));
        
        
        setBonCommandesData(formattedData.reverse());
      }
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de la récupération des données des bons de commande :",
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBonCommandeData(id);
      await fetchData();
    } catch (error) {
      console.error("Une erreur s'est produite lors de la suppression du bon de commande :", error);
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
        <h1 className="text-2xl font-semibold">Liste des bons de commande</h1>
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
              <TableHead>
              <Link className="flex justify-center items-center " href={"/bonCommande/add"}>
                  <IoIosAddCircle className=" w-4 h-4 cursor-pointer hover:scale-[1.2] " />
                </Link>
                </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bonCommandesData && bonCommandesData.length > 0 ? (
              bonCommandesData.map((row:any, rowIndex:number) => (
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
                        {/* link to view bon Commandes page */}
                      <Link href={`/bonCommande/view/${row.Id}`}>
                      <div className="w-4 h-4 cursor-pointer hover:scale-[1.1]">
                      <LuFileSearch2 />
                      </div>
                        </Link>
                      {/** link to edit bon Commande page */}
                      <Link href={`/bonCommande/${row.Id}`}>
                      <div className="w-4 h-4 cursor-pointer hover:scale-[1.1]">
                      <MdEdit />
                      </div>
                        </Link>
                      {/** Dialog to delete bon Commandes */}
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
