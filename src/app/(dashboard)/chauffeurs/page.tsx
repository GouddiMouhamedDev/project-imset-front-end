"use client"
import React, { useEffect, useState } from "react";
import Blueloading from "@/components/loading";
import SearchBar from "@/components/searchBar";
import { useRouter } from "next/navigation";
import { auth, getUserInfoFromStorage, removeStorage } from "@/api/auth";
import {
  getChauffeursData,
  deleteOneChauffeurData,
} from "@/api/chauffeurs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EditChauffeurForm from "@/components/editChauffeurForm";
import AddChauffeurForm from "@/components/addChauffeurForm";
import { MdDeleteForever } from "react-icons/md";
import {ChauffeurData, ChauffeurFormatedData } from "@/types/Chauffeur";

export default function Chauffeurs() {
  const [chauffeursData, setChauffeursData] = useState<ChauffeurFormatedData[]>([]);
  const userRole = getUserInfoFromStorage()?.role;
  const isAdmin = ["super-admin", "admin"].includes(userRole!);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const columnHeaders = Object.keys(
    chauffeursData && chauffeursData.length > 0 ? chauffeursData[0] : {});

  const handleEditSuccess = () => {
    fetchData();
  };

  const fetchData = async () => {
    try {
      const isAuthenticated = auth(["admin", "super-admin","user"]);
      if (!isAuthenticated) {
        removeStorage();
        router.push("/login");
      } else {
        const response = await getChauffeursData();
        const getdata:ChauffeurData[] = response;
        const chauffeurFormatedData: ChauffeurFormatedData[] = getdata.map(
            (item: ChauffeurData) => ({
              Id: item._id,
              CIN: item.cin,
              Nom: item.name,
            
            })
          );
        setChauffeursData(chauffeurFormatedData);
      }
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de la récupération des données :",
        error
      );
    } finally {
      setIsLoading(false);  
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteOneChauffeurData(id);
      await fetchData();
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de la suppression du chauffeur :",
        error
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return <Blueloading />;
  }

  return (
    <div className="min-h-screen p-4">
      <div className="border-b-2 border-slate-400 pb-4 mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Liste des chauffeurs</h1>
      </div>
      <SearchBar />
      <div className="rounded-md border mt-2">
        <Table>
          <TableHeader>
            <TableRow>
              {columnHeaders
                .filter((header) => header !== "Id")
                .map((header) => (
                  <TableHead key={header}>{header}</TableHead>
                ))}
                  {isAdmin && (
              <TableHead className="flex justify-center pt-3 border-spacing-1">
                <AddChauffeurForm onSubmitSuccess={handleEditSuccess} />
              </TableHead>
                  )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {chauffeursData && chauffeursData.length > 0 ? (
              chauffeursData.map((row:any, rowIndex: number) => (
                <TableRow key={rowIndex}>
                  {columnHeaders
                    .filter((header) => header !== "Id")
                    .map((header, columnIndex) => (
                      <TableCell key={columnIndex}>
                        <span>{row[header]}</span>
                      </TableCell>
                    ))}
                      {isAdmin && (
                  <TableCell className="flex place-content-center">
                    <div className="flex flex-row space-x-2">
                      <EditChauffeurForm
                        chauffeurId={row.Id}
                        onSubmitSuccess={handleEditSuccess}
                      />
                    
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <div className="w-4 h-4 cursor-pointer hover:scale-[1.1]" >  <MdDeleteForever /></div>
                          
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Êtes-vous absolument sûr ?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Cette action ne peut pas être annulée. Cela
                                supprimera définitivement vos données.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>
                                Annuler
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(row["Id"])}
                              >
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
