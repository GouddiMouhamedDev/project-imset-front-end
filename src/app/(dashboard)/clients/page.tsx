"use client"
import React, { useEffect, useState } from "react";
import {
  deleteOneClientData,
  getClientsData,
} from "@/api/clients";
import Blueloading from "@/components/loading";
import SearchBar from "@/components/searchBar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth, getUserInfoFromStorage, removeStorage } from "@/api/auth";
import { ClientData } from "@/types/clients";
import { MdDeleteForever, MdEdit } from "react-icons/md";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IoIosAddCircle } from "react-icons/io";
import EditClientForm from "@/components/editClientForm";

export default function Clients() {
  const [clientsData, setClientsData] = useState<ClientData[]>([]);
  const userRole = getUserInfoFromStorage()?.role;
  const isAdmin = ["super-admin", "admin"].includes(userRole!);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const columnHeaders = Object.keys(clientsData && clientsData.length > 0 ? clientsData[0] : {});
  const [msg, setMsg] = useState<any>();
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const isAuthenticated = auth(["admin", "super-admin", "user"]);
      if (!isAuthenticated) {
        removeStorage();
        router.push("/login");
      } else {
        const data: ClientData[] = await getClientsData();
        setClientsData(data);
      }
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de la récupération des données des clients :",
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
      const response = await deleteOneClientData(id);
      await fetchData();
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de la suppression du client :",
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
        <h1 className="text-2xl font-semibold">Liste des clients</h1>
      </div>
      <SearchBar />
      <div className="rounded-md border mt-2">
        <Table>
          <TableHeader>
            <TableRow>
              {columnHeaders.map((header) => (
                <TableHead key={header}>{header}</TableHead>
              ))}
              <TableHead className="flex justify-center pt-3">
                <Link href={"/clients/add"}>
                  <IoIosAddCircle className=" w-4 h-4 cursor-pointer hover:scale-[1.2] " />
                </Link>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientsData && clientsData.length > 0 ? (
              clientsData.map((row: any, rowIndex: number) => (
                <TableRow key={rowIndex}>
                  {columnHeaders.map((header, columnIndex) => (
                    <TableCell key={columnIndex}>
                      <span>{row[header]}</span>
                    </TableCell>
                  ))}
                  <TableCell className="flex place-content-center">
                    <div className="flex flex-row space-x-2">
                     <EditClientForm 
                     clientId={row.id} 
                     onSubmitSuccess={handleEditFormSubmit}/>
                      {isAdmin && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <MdDeleteForever className="w-4 h-4 cursor-pointer hover:scale-[1.1]" />
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
                              <AlertDialogAction
                                onClick={() => handleDelete(row["Id"])}
                              >
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
