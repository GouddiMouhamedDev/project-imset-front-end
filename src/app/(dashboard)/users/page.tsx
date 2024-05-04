"use client";
import React, { useEffect, useState } from "react";
import {
  deleteOneUserData,
  getUsersData,
  updateOneUserData,
} from "@/api/users";
import Blueloading from "@/components/loading";
import MultiDataTable from "@/components/multiDataTable";
import { Button } from "@/components/ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "@/components/ui/input";
import { SubmitHandler, useForm } from "react-hook-form";
import { IoEllipsisHorizontal } from "react-icons/io5";
import { MdDeleteForever, MdEdit } from "react-icons/md";

export default function Users() {
  const userRole = getUserInfoFromStorage()?.role;
  const isAdmin = ["super-admin", "admin"].includes(userRole!);
  const [data, setData] = useState<User[]>([]);
  const [msg,setMsg]=useState<any>();
  const [usersData, setUsersData] = useState<UserFormatedData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const columnHeaders = Object.keys(
    usersData && usersData.length > 0 ? usersData[0] : {}
  );
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const onSubmit: SubmitHandler<any> = async (formData) => {
    const { id, ...rest } = formData;
    try {
      const response = await updateOneUserData(id, rest);
      setMsg((response as { data: { msg: string } }).data.msg);
      fetchData();
    } catch (error) {
      console.error("Une erreur s'est produite lors de Update :", error);
    }
  };

  const fetchData = async () => {
    try {
      const data = await getUsersData();
      setData(data);
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
      const response = await deleteOneUserData(id);
      console.log(response);
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
    const fetchDataAfterAuth = async () => {
      const isAuthenticated = auth(["admin", "super-admin"]);
      if (isAuthenticated) {
        fetchData();
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
        <h1 className="text-2xl font-semibold">Liste des utilisateurs</h1>
        {isAdmin ? (
          <Button>
            <Link href={"/users/add"}>Ajouter un utilisateur</Link>
          </Button>
        ) : (
          <Button disabled>
            <Link href={"/users/add"}>Ajouter un utilisateur</Link>
          </Button>
        )}
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
              <TableHead>
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
                  {/* Cellule pour le bouton */}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <div className="cursor-pointer hover:scale-[1.1]">
                          <IoEllipsisHorizontal />
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent >
                        <DropdownMenuItem>
                          <div onClick={(e) => e.stopPropagation()}>
                            <Dialog>
                              <DialogTrigger asChild>
                                <div className="flex items-center cursor-pointer space-x-4">
                                  <MdEdit className="w-4 h-4" />
                                  <div className="ml-1">Modifier</div>
                                </div>
                              </DialogTrigger>

                              <DialogContent className="sm:max-w-[425px]">
                                <form onSubmit={handleSubmit(onSubmit)}>
                                  <DialogHeader>
                                    <DialogTitle>Modifier le profil</DialogTitle>
                                    <DialogDescription>
                                    Apportez des modifications au profil ici.
                                     Cliquez sur Enregistrer lorsque vous avez terminé
                                    </DialogDescription>
                                  </DialogHeader>
                                  {/* Champ caché pour l'ID */}
                                  <input
                                    type="hidden"
                                    {...register("id")}
                                    value={row["id"]}
                                  />
                                  {/* Autres champs de formulaire */}
                                  <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label className="text-right">Nom</Label>
                                      {/* Utilisez la valeur du nom de la ligne */}
                                      <Input
                                        {...register("name")}
                                        id="name"
                                        defaultValue={row["Nom"]} // Utilisation de la valeur de la colonne "Nom" de la ligne actuelle
                                        className="col-span-3"
                                      />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label className="text-right">
                                        Email
                                      </Label>
                                      {/* Utilisez la valeur de l'email de la ligne */}
                                      <Input
                                        {...register("email")}
                                        id="email"
                                        defaultValue={row["Email"]} // Utilisation de la valeur de la colonne "Email" de la ligne actuelle
                                        className="col-span-3"
                                      />
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <div className="text-xs pt-3">{msg}</div>
                                    <Button
                                      type="submit"
                                      disabled={isSubmitting}
                                    >
                                      Enregistrer les modifications
                                    </Button>
                                  </DialogFooter>
                                </form>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </DropdownMenuItem>
                        {userRole === "super-admin" && (
                          <DropdownMenuItem>
                            <div onClick={(e) => e.stopPropagation()}>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <div className="flex items-center cursor-pointer space-x-4">
                                    <MdDeleteForever className="w-4 h-4" />
                                    <div className="ml-1">suprimer</div>
                                  </div>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Êtes-vous absolument sûr ?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Cette action ne peut pas être annulée.
                                      Cela supprimera définitivement vos données
                                      .
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Annuler
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(row.id)}
                                    >
                                      Continuer
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
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
