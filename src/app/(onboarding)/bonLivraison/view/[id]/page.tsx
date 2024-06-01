"use client";
import { auth, removeStorage } from '@/api/auth';
import ViewBon from '@/components/ViewBon';
import React, { useEffect,  useState } from 'react';
import { useRouter } from "next/navigation";
import { BonLivraisonData } from '@/types/bonLivraison';
import { getOneBonLivraisonData } from '@/api/bonLivraison';
import { format } from "date-fns";
import { getOneUserData } from '@/api/users';
import { getOneClientData } from '@/api/clients';
import BlueLoading from "@/components/loading";
import { getSocieteData } from '@/api/societe';
export default function Home({
  params: { id },
}: {
  params: { id: string };
}) {

  const router = useRouter();
  const [viewData, setViewData] = useState<any>();


  const fetchOneBonLivraison = async (id: string) => {
    try {
      const data: BonLivraisonData = await getOneBonLivraisonData(id);
      const userData = await getOneUserData(data.userId);
      const clientData = await getOneClientData(data.client);
      const societeData = await getSocieteData();

      const formattedProducts = data.produits.map((produit) => ({
        designation: produit.nomProduit,
        unitPrice: produit.prixUnitaireHT,
        qty: produit.quantite,
        totalPrice: produit.montantTTC,
      }));

      const dataView = {
        clientCode: clientData.idClient,
        clientName: clientData.nom,
        clientPhone: clientData.telephone,
        clientMat: clientData.identifiantFiscaleClient,
        clientAddress: data.destination,
        deliveryNoteNumber: data.idBonLivraison,
        creationDate: format(data.dateLivraison, "dd/MM/yyyy"),
        products: formattedProducts,
        totalHT: data.prixTotalHT,
        totalTVA:data.montantTVA,
        totalTTC: data.prixTotalTTC,
        vendor: userData.name,
        vehicle: data.vehicle,
        chauffeur: data.chauffeur,
        societeName: societeData.name,
        societeActivity: societeData.activité,
        societeAdresse: societeData.address,
        sociteGsm: societeData.Gsm,
        societeTel  :societeData.Tél,
        societeRc:societeData.RC,
        societeMf:societeData.MF,
      };
      
      setViewData(dataView);
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de la récupération des données d'un bon de livraison :",
        error
      );
    }
  };
  const fetchDataAfterAuth = async () => {
    const isAuthenticated = auth(["admin", "super-admin", "user"]);
    if (isAuthenticated) {
      await Promise.all([
         fetchOneBonLivraison(id),
        ]);
    } else {
      removeStorage();
      router.push("/login");
    }
  };

  useEffect(() => {
    fetchDataAfterAuth();
  }, []);


  
  return (
    <div className="container mx-auto p-4">
   {viewData ? <ViewBon {...viewData} /> : <BlueLoading />}
    </div>
  );
}
