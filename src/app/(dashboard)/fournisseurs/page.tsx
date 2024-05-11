"use client";
import React, { useEffect, useState } from "react";
import {
  deleteOneFournisseurData,
  getFournisseursData,
} from "@/api/fournisseurs";
import Blueloading from "@/components/loading";
import SearchBar from "@/components/searchBar";
import { useRouter } from "next/navigation";
import { auth, getUserInfoFromStorage, removeStorage } from "@/api/auth";
import { FournisseurData, FournisseurFormatData } from "@/types/fournisseurs";
import { MdDeleteForever } from "react-icons/md";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import EditFournisseurForm from "@/components/editFournisseurForm";
import AddFournisseurForm from "@/components/addFournisseurForm";

export default function Fournisseurs() {
  const [fournisseursData, setFournisseursData] = useState<FournisseurFormatData[]>([]);
  const userRole = getUserInfoFromStorage()?.role;
  const isAdmin = ["super-admin", "admin"].includes(userRole!);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const columnHeaders = Object.keys(fournisseursData && fournisseursData.length > 0 ? fournisseursData[0] : {});

  const fetchData = async () => {
    try {
      const isAuthenticated = auth(["admin", "super-admin", "user"]);
      if (!isAuthenticated) {
        removeStorage();
        router.push("/login");
      } else {
        const data: FournisseurData[] = await getFournisseursData();
        const formattedData: FournisseurFormatData[] = data.map((fournisseur) => ({
          Id: fournisseur._id,
          Nom: fournisseur.nom,
          Telephone: fournisseur.telephone,
          IdentifiantFiscale: fournisseur.identifiantFiscaleFournisseur,
        }));
        setFournisseursData(formattedData);
      }
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de la récupération des données des fournisseurs :",
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
      await deleteOneFournisseurData(id);
      await fetchData();
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de la suppression du fournisseur :",
        error
      );
    }
  };

  const handleEditSuccess = () => {
    fetchData();
  };

  useEffect(() => {
    const fetchDataAfterAuth = async () => {
      const isAuthenticated = auth(["admin", "super-admin", "user"]);
      if (isAuthenticated) {
        await fetchData();
      } else {
        removeStorage();
        router.push("/login");
      }
    };
  
    fetchDataAfterAuth();
  }, []); 

  if (isLoading) {
    return <Blueloading />;
  }

  return (
    <div className="min-h-screen p-4">
      <div className="border-b-2 border-slate-400 pb-4 mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Liste des fournisseurs</h1>
      </div>
      <SearchBar />
      <div className="rounded-md border mt-2">
        <Table>
          <TableHeader>
            <TableRow>
              {columnHeaders
                .filter((header) => header !== "Id")
                .map((header) => (
                  <TableHead key={header}>
                    {header === "IdentifiantFiscale" ? "Identifiant Fiscale" : header}
                  </TableHead>
                ))}
              <TableHead className="flex justify-center pt-3">
                <AddFournisseurForm onSubmitSuccess={handleEditSuccess} />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fournisseursData && fournisseursData.length > 0 ? (
              fournisseursData.map((row: any, rowIndex: number) => (
                <TableRow key={rowIndex}>
                  {columnHeaders
                    .filter((header) => header !== "Id")
                    .map((header, columnIndex) => (
                      <TableCell key={columnIndex}>
                        <span>{row[header]}</span>
                      </TableCell>
                    ))}
                  <TableCell className="flex place-content-center">
                    <div className="flex flex-row space-x-2">
                      <EditFournisseurForm fournisseurId={row.Id} onSubmitSuccess={handleEditFormSubmit} />
                      {isAdmin && (
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
                              <AlertDialogAction onClick={() => handleDelete(row.Id)}>
                                Continuer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </TableCell>
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
