"use client";
import React, { useEffect, useState } from "react";
import { getVehiclesData } from "@/api/vehicles";
import { UsersData } from "@/interface/users";
import Blueloading from "@/components/loading";
import MultiDataTable from "@/components/multiDataTable";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/searchBar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth, removeStorage } from "@/api/auth";
import { VehicleData, VehicleFormatedData } from "@/types/vehicles";

export default function Vehicles() {
  const [vehiclesData, setVehiclesData] = useState<VehicleFormatedData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const fetchData = async () => {
    try {
      const isAuthenticated = auth(["admin", "super-admin", "user"]);
      if (!isAuthenticated) {
        removeStorage();
        router.push("/login");
      } else {
        const data = await getVehiclesData();
        const VehicleFormatedData: VehicleFormatedData[] = data.map((item: VehicleData) => ({
          Id: item._id,
          Matricule: item.matriculeVehicule
        }));
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

  if (isLoading) {
    return <Blueloading />;
  }

  return (
    <div className="min-h-screen p-4">
      <div className="border-b-2 border-slate-400 pb-4 mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">liste des véhicules</h1>
        <Button >
          <Link href={"/vehicles/add"}>Ajouter un Vehicule </Link>
        </Button>
      </div>
      <SearchBar />
      <MultiDataTable data={vehiclesData} To="vehicles" />
    </div>
  );
}
