"use client"
import React, { useEffect, useState } from "react";
import {
  deleteOneVehicleData,
  getVehiclesData,
  updateOneVehicleData,
} from "@/api/vehicles";
import Blueloading from "@/components/loading";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/searchBar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth, getUserInfoFromStorage, removeStorage } from "@/api/auth";
import { VehicleData, VehicleFormatedData } from "@/types/vehicles";
import { IoIosAddCircle } from "react-icons/io";
import { IoEllipsisHorizontal } from "react-icons/io5";
import { MdDeleteForever, MdEdit } from "react-icons/md";
import { Label } from "@radix-ui/react-dropdown-menu";
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

import { Input } from "@/components/ui/input";  
import { SubmitHandler, useForm } from "react-hook-form";

export default function Vehicles() {
  const [vehiclesData, setVehiclesData] = useState<VehicleFormatedData[]>([]);
  const userRole = getUserInfoFromStorage()?.role;
  const isAdmin = ["super-admin", "admin"].includes(userRole!);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const columnHeaders = Object.keys(vehiclesData && vehiclesData.length > 0 ? vehiclesData[0] : {});
  const [msg,setMsg]=useState<any>();
  const { register,
     handleSubmit, 
     formState: { isSubmitting },
      reset } = useForm();
  const [selectedVehicleId, setSelectedVehicleId] 
  = useState<string | null>(null);

  const onSubmit: SubmitHandler<any> = async (formData) => {
    try {
      const { Matricule } = formData;
      const formattedData = {
        matriculeVehicule: Matricule,
      };
      const response = await updateOneVehicleData(formData.Id, formattedData);
      setMsg((response as { data: { msg: string } }).data.msg);
      await fetchData();
    } catch (error) {
      console.error("Une erreur s'est produite lors de Update :", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await deleteOneVehicleData(id);
      await fetchData();
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de la suppression de l'utilisateur :",
        error
      );
    }
  };

  const fetchData = async () => {
    try {
      const isAuthenticated = auth(["admin", "super-admin", "user"]);
      if (!isAuthenticated) {
        removeStorage();
        router.push("/login");
      } else {
        const getdata: VehicleData[] = await getVehiclesData();
        const VehicleFormatedData: VehicleFormatedData[] = getdata.map(
          (item: VehicleData) => ({
            Id: item._id,
            Matricule: item.matriculeVehicule,
          })
        );
        setVehiclesData(VehicleFormatedData);
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

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Vérifie si un véhicule est sélectionné
    if (selectedVehicleId) {
      // Récupère les données du véhicule sélectionné
      const selectedVehicle = vehiclesData.find((vehicle) => 
        vehicle.Id === selectedVehicleId);
      // Si les données du véhicule sélectionné sont disponibles, réinitialise le formulaire avec ces données
      if (selectedVehicle) {
        setMsg("");
        reset(selectedVehicle);
      }
    }
  }, [selectedVehicleId]);

  if (isLoading) {
    return <Blueloading />;
  }

  return (
    <div className="min-h-screen p-4">
      <div className="border-b-2 border-slate-400 pb-4 mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Liste des véhicules</h1>
      </div>
      <SearchBar />
      <div className="rounded-md border mt-2">
        <Table>
          <TableHeader>
            <TableRow>
              {columnHeaders
                .filter((header) => header !== "id")
                .map((header) => (
                  <TableHead key={header}>{header}</TableHead>
                ))}
              <TableHead className="flex justify-center pt-3">
                <Link href={"/vehicles/add"}>
                  <IoIosAddCircle className=" w-4 h-4 cursor-pointer hover:scale-[1.2] " />
                </Link>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehiclesData && vehiclesData.length > 0 ? (
              vehiclesData.map((row: any, rowIndex: number) => (
                <TableRow key={rowIndex}>
                  {columnHeaders
                    .filter((header) => header !== "id")
                    .map((header, columnIndex) => (
                      <TableCell key={columnIndex}>
                        <span>{row[header]}</span>
                      </TableCell>
                    ))}
                  <TableCell className="flex place-content-center">
                    <div className="flex flex-row space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <MdEdit
                            className="w-4 h-4 cursor-pointer hover:scale-[1.1]"
                            onClick={() => setSelectedVehicleId(row["Id"])}
                          />
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <form onSubmit={handleSubmit(onSubmit)}>
                            <DialogHeader>
                              <DialogTitle>Modifier le véhicules</DialogTitle>
                              <DialogDescription>
                                Apportez des modifications au véhicule ici.
                                Cliquez sur Enregistrer lorsque vous avez
                                terminé.
                              </DialogDescription>
                            </DialogHeader>
                            <input
                              type="hidden"
                              {...register("Id")}
                              value={row["Id"]}
                            />
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Matricule</Label>
                                <Input
                                  {...register("Matricule")}
                                  id="Matricule"
                                  defaultValue={row["Matricule"]}
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
                      {userRole === "super-admin" && (
                       
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <MdDeleteForever
                                className="w-4 h-4 cursor-pointer hover:scale-[1.1]"
                              />
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Êtes-vous absolument sûr ?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Cette action ne peut pas être annulée.
                                  Cela supprimera définitivement vos
                                  données.
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
