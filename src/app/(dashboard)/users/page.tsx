"use client";

import React, { useEffect, useState } from "react";
import { deleteOneUserData, getUsersData } from "@/api/users";
import Blueloading from "@/components/loading";
import SearchBar from "@/components/searchBar";
import Link from "next/link";
import { UserFormatedData, User } from "@/types/user";
import { auth, getUserInfoFromStorage, removeStorage } from "@/api/auth";
import { useRouter } from "next/navigation";
import { IoIosAddCircle } from "react-icons/io";
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
import { MdDeleteForever } from "react-icons/md";
import EditUserForm from "@/components/editUserForm";

export default function Users() {
  const userRole = getUserInfoFromStorage()?.role;
  const [usersData, setUsersData] = useState<UserFormatedData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  const handleEditFormSubmit = () => {
    fetchData();
  };
  const columnHeaders = Object.keys(
    usersData && usersData.length > 0 ? usersData[0] : {}
  );

  const fetchData = async () => {
    try {
      const data = await getUsersData();
      const formatedData: UserFormatedData[] = data.map((item: User) => ({
        id: item._id,
        Nom: item.name,
        Email: item.email,
        Rôle: item.role,
      }));
      setUsersData(formatedData);
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
      await deleteOneUserData(id);

      // Mettre à jour les données après la réussite de la suppression
      fetchData();
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de la suppression de l'utilisateur :",
        error
      );
    }
  };

  useEffect(() => {
    (async () => {
      const fetchDataAfterAuth = async () => {
        const isAuthenticated = auth(["super-admin"]);
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
        <h1 className="text-2xl font-semibold">Liste des utilisateurs</h1>
      </div>
      <SearchBar />
      <div className="rounded-md border mt-2">
        <Table>
          <TableHeader>
            <TableRow>
              {/* Bouclez sur les en-têtes de colonne */}
              {columnHeaders
                .filter((header) => header !== "id") // Filtrer le champ ID
                .map((header) => (
                  <TableHead key={header}>{header}</TableHead>
                ))}
              <TableHead className="flex justify-center pt-3">
                <Link href={"/users/add"}>
                  <IoIosAddCircle className=" w-4 h-4 cursor-pointer hover:scale-[1.2] " />
                </Link>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usersData && usersData.length > 0 ? (
              usersData.map((row: any, rowIndex: number) => (
                <TableRow key={rowIndex}>
                  {/* Bouclez sur les données de la ligne, en excluant le champ ID */}
                  {columnHeaders
                    .filter((header) => header !== "id")
                    .map((header, columnIndex) => (
                      <TableCell key={columnIndex}>
                        <span>{row[header]}</span>
                      </TableCell>
                    ))}
                  {/* Cellule pour les boutons */}
                  <TableCell className="flex place-content-center">
                  <div className="flex flex-row space-x-2">
                    <EditUserForm userId={row.id} 
                    onSubmitSuccess={handleEditFormSubmit}/>
                    {userRole === "super-admin" && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <div className="flex items-center cursor-pointer space-x-4">
                            <div className="w-4 h-4">
                            <MdDeleteForever  />
                            </div>
                          
                          </div>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Êtes-vous absolument sûr ?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Cette action ne peut pas être annulée. Cela
                              supprimera définitivement vos données .
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(row.id)}
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
