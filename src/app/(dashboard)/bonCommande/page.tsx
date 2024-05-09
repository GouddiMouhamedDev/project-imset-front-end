"use client"
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, removeStorage } from "@/api/auth";
import { getBonCommandesData, deleteBonCommandeData } from "@/api/bonCommandes";
import BlueLoading from "@/components/loading";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { MdDeleteForever } from "react-icons/md";
import { BonCommandeData } from "@/types/BonCommande";

export default function BonCommandes(){
  const [bonCommandesData, setBonCommandesData] = useState<BonCommandeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchData = async () => {
    try {
      const isAuthenticated = auth(["admin", "super-admin", "user"]);
      if (!isAuthenticated) {
        removeStorage();
        router.push("/login");
      } else {
        const data = await getBonCommandesData();
      
        setBonCommandesData(data);
      }
    } catch (error) {
      console.error("Une erreur s'est produite lors de la récupération des données des bons de commande :", error);
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
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nom du Client</TableCell>
            <TableCell>Date de commande</TableCell>
            <TableCell>Prix total TTC</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {bonCommandesData && bonCommandesData.map((bonCommande) => (
  <TableRow key={bonCommande._id}>
    <TableCell>{bonCommande.client}</TableCell>
    <TableCell>{bonCommande.dateCommande}</TableCell>
    <TableCell>{bonCommande.prixTotalTTC}</TableCell>
    <TableCell>
      <MdDeleteForever onClick={() => handleDelete(bonCommande._id)} className="text-red-500 cursor-pointer" />
    </TableCell>
  </TableRow>
))}

        </TableBody>
      </Table>
    </div>
  );
}
