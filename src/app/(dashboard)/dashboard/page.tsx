"use client";
import { auth, removeStorage } from "@/api/auth";
import { useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import React from "react";


import ChartOne from "@/components/Charts/ChartOne";
import ChartTwo from "@/components/Charts/ChartTwo";
import CardDataStats from "@/components/Charts/CardDataStats";
import { BonLivraisonData } from "@/types/bonLivraison";
import { getBonLivraisonsData } from "@/api/bonLivraison";
import { ApiClientData } from "@/types/clients";
import { getClientsData } from "@/api/clients";
import { ProduitData } from "@/types/produits";
import { getProduitsData } from "@/api/produits";
import { TfiUser } from "react-icons/tfi";
import { BonReceptionData } from "@/types/bonReception";
import { getBonReceptionsData } from "@/api/bonReception";
import { PiMoneyWavyFill } from "react-icons/pi";
import { GiHandTruck } from "react-icons/gi";
import { set } from "date-fns";
import Blueloading from "@/components/loading";


    



export default function Dash() {
  const [clientData, setClientData] = useState<ApiClientData[]>([]);
  const [bonLivraisonData, setBonLivraisonData] = useState<BonLivraisonData[]>([]);
  const [bonReceptionData, setBonReceptionData] = useState<BonReceptionData[]>([]);
  let totalClients:string=clientData?.length.toString()|| "0";
  const [activeClientsPercent, setActiveClientsPercent] = useState<string>('0%');
  const router = useRouter();
  const [rateProfit, setRateProfit] = useState("0%");
  const [rateVente, setRateVente] = useState("0%");
  const [rateAchat, setRateAchat] = useState("0%");
  const [venteData, setVenteData] = useState<any>();
  const [achatData, setAchatData] = useState<any>();
  const [loading, setLoading] = useState(true);
  const fetchBonLivraisonData = async () => {

    try{
      const data: BonLivraisonData[] = await getBonLivraisonsData();
      setBonLivraisonData(data);
  }catch(error){
    console.error(
      "Une erreur s'est produite lors de la récupération des données des bon de livraison :",
      error
    );
  }};
  const fetchBonReceptionData = async () => {

    try{
      const data: BonReceptionData[] = await getBonReceptionsData(); 
      setBonReceptionData(data);
  }catch(error){
    console.error(
      "Une erreur s'est produite lors de la récupération des données des bon de livraison :",
      error
    );
  }};
  const fetchProductsData = async () => {
    try {
      const data: ProduitData[] = await getProduitsData();
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de la récupération des données des produits :",
        error
      );
    }
  };
  const fetchClientData = async () => {
    try {
      const data: ApiClientData[] = await getClientsData();
      setClientData(data);
    }catch (error) {
      console.error(
        "Une erreur s'est produite lors de la récupération des données des clients :",
        error
      );
    }
  };
  const calculateActiveClientsPercent = async () => {
    const currentDate = new Date();
    const thirtyDaysAgo = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 jours en millisecondes
    
    // Utiliser un ensemble pour stocker les IDs des clients uniques
    const activeClientsSet = new Set();
    
    // Filtrer les bons de livraison pour inclure ceux avec une date de livraison dans la période spécifiée
    bonLivraisonData.forEach(bl => {
      if (new Date(bl.dateLivraison) >= thirtyDaysAgo) {
        activeClientsSet.add(bl.client); // Ajouter l'ID du client au set des clients actifs
      }
    });
    
    // Convertir l'ensemble en un tableau pour obtenir le nombre de clients uniques actifs
    const activeClientsCount = activeClientsSet.size;
    const totalClientsCount = clientData.length; // Nombre total de clients
  
    if (totalClientsCount > 0) {
      const percent = ((activeClientsCount / totalClientsCount) * 100).toFixed(2) + "%";
      setActiveClientsPercent(percent);
    } 
  };
  const calculateMonthlyTotals = (data: any[], targetMonth: number, targetYear: number, dateField: string): number => {
    const monthData = data.filter(item => {
      const itemDate = new Date(item[dateField]);
      return itemDate.getMonth() === targetMonth && itemDate.getFullYear() === targetYear;
    });
  
    const total = monthData.reduce((acc, item) => acc + item.prixTotalTTC, 0);
    return total;
  };
  const calculateMonthlyProfit = (bonLivraisonData: BonLivraisonData[], bonReceptionData: BonReceptionData[], targetMonth: number, targetYear: number): number => {
    const totalVente = calculateMonthlyTotals(bonLivraisonData, targetMonth, targetYear, 'dateLivraison');
    const totalAchat = calculateMonthlyTotals(bonReceptionData, targetMonth, targetYear, 'dateReception');
  
    return totalVente - totalAchat;
  };
  const calculateRate = (currentProfit: number, previousProfit: number): string => {
    if (previousProfit === 0) return "N/A"; // Pour éviter la division par zéro
    const Rate = ((currentProfit - previousProfit) / previousProfit) * 100;
    return Rate.toFixed(2) + "%";
  };
  // Fonction pour construire les données de vente filtrées pour le mois et l'année sélectionnés
  const buildVenteData = (
    targetMonth: number,
    targetYear: number
  ): { dateLivraison: string; montantVente: number }[] => {
    const groupedData: { [key: string]: number } = {};
  
    bonLivraisonData
      .filter((bl) => {
        const itemDate = new Date(bl.dateLivraison);
        return itemDate.getMonth() === targetMonth && itemDate.getFullYear() === targetYear;
      })
      .forEach((bl) => {
        const dateKey = new Date(bl.dateLivraison).toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "numeric",
        });
        if (!groupedData[dateKey]) {
          groupedData[dateKey] = 0;
        }
        groupedData[dateKey] += bl.prixTotalTTC;
      });
  
    const sortedData = Object.keys(groupedData)
      .map(date => ({
        dateLivraison: date,
        montantVente: groupedData[date] as number
      }))
      .sort((a, b) => {
        const [dayA, monthA] = a.dateLivraison.split("/").map(Number);
        const [dayB, monthB] = b.dateLivraison.split("/").map(Number);
        const dateA = new Date(targetYear, monthA - 1, dayA);
        const dateB = new Date(targetYear, monthB - 1, dayB);
        return dateA.getTime() - dateB.getTime();
      });
  
    return sortedData;
  };
  
  

  // Fonction pour construire les données d'achat filtrées pour le mois et l'année sélectionnés
  const buildAchatData = (
    targetMonth: number,
    targetYear: number
  ): { dateReception: string; montantAchat: number }[] => {
    const groupedData: { [key: string]: number } = {};
  
    bonReceptionData
      .filter((br) => {
        const itemDate = new Date(br.dateReception);
        return itemDate.getMonth() === targetMonth && itemDate.getFullYear() === targetYear;
      })
      .forEach((br) => {
        const dateKey = new Date(br.dateReception).toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "numeric",
        });
        if (!groupedData[dateKey]) {
          groupedData[dateKey] = 0;
        }
        groupedData[dateKey] += br.prixTotalTTC;
      });
  
    const sortedData = Object.keys(groupedData)
      .map(date => ({
        dateReception: date,
        montantAchat: groupedData[date] as number
      }))
      .sort((a, b) => {
        const [dayA, monthA] = a.dateReception.split("/").map(Number);
        const [dayB, monthB] = b.dateReception.split("/").map(Number);
        const dateA = new Date(targetYear, monthA - 1, dayA);
        const dateB = new Date(targetYear, monthB - 1, dayB);
        return dateA.getTime() - dateB.getTime();
      });
  
    return sortedData;
  };
  const fetchDataAfterAuth = async () => {
    const isAuthenticated = auth(["admin", "super-admin", "user"]);
    if (isAuthenticated) {
      try {
        // Attendre que toutes les promesses se résolvent avant de continuer
        await Promise.all([
          fetchProductsData(),
          fetchClientData(),
          fetchBonLivraisonData(),
          fetchBonReceptionData(),
          
        ]);
          // Une fois que toutes les données sont chargées avec succès,
        // exécuter le calcul des pourcentages 
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1; // Gérer le cas de janvier
        const previousYear = previousMonth === 11 ? currentYear - 1 : currentYear;
  
        const currentMonthProfit = calculateMonthlyProfit(bonLivraisonData, bonReceptionData, currentMonth, currentYear);
        const previousMonthProfit = calculateMonthlyProfit(bonLivraisonData, bonReceptionData, previousMonth, previousYear);
        const rateProfit = calculateRate(currentMonthProfit, previousMonthProfit);
        setRateProfit(rateProfit);

        const  currentMothVente =calculateMonthlyTotals(bonLivraisonData, currentMonth, currentYear, 'dateLivraison');
        const previousMonthVente =calculateMonthlyTotals(bonLivraisonData, previousMonth, previousYear, 'dateLivraison');
        const rateVente=calculateRate(currentMothVente,previousMonthVente);
        setRateVente(rateVente);


        const  currentMothAchat =calculateMonthlyTotals(bonReceptionData, currentMonth, currentYear, 'dateReception');
        const previousMonthAchat=calculateMonthlyTotals(bonReceptionData, previousMonth, previousYear, 'dateReception');
        const rateAchat=calculateRate(currentMothAchat,previousMonthAchat);
        setRateAchat(rateAchat);

        calculateActiveClientsPercent();
        setVenteData(buildVenteData(currentMonth, currentYear));
        setAchatData(buildAchatData(currentMonth, currentYear));

      
      } catch (error) {
        // En cas d'erreur lors du chargement des données, vous pouvez gérer l'erreur ici
        console.error("Erreur lors du chargement des données :", error);
      }
      finally {
      setLoading(false);
    }
    } else {
      // Si l'utilisateur n'est pas authentifié, supprimer les données stockées et rediriger vers la page de connexion
      removeStorage();
      router.push("/login");
    }
    
  };
 


  useEffect(() => {
    const fetchData = async () => {
      await fetchDataAfterAuth();
    };
    fetchData();
  }, [loading]);

 if (loading) {
    return <><Blueloading/></>;
  }
  return (
    
       <> 
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats 
        title="Achat" 
        total={bonReceptionData.reduce((acc, br) => acc + br.prixTotalTTC, 0).toFixed(2) + " DT"}
         rate={rateAchat}
         levelUp>
            <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21.1063 18.0469L19.3875 3.23126C19.2157 1.71876 17.9438 0.584381 16.3969 0.584381H5.56878C4.05628 0.584381 2.78441 1.71876 2.57816 3.23126L0.859406 18.0469C0.756281 18.9063 1.03128 19.7313 1.61566 20.3844C2.20003 21.0375 2.99066 21.3813 3.85003 21.3813H18.1157C18.975 21.3813 19.8 21.0031 20.35 20.3844C20.9 19.7656 21.2094 18.9063 21.1063 18.0469ZM19.2157 19.3531C18.9407 19.6625 18.5625 19.8344 18.15 19.8344H3.85003C3.43753 19.8344 3.05941 19.6625 2.78441 19.3531C2.50941 19.0438 2.37191 18.6313 2.44066 18.2188L4.12503 3.43751C4.19378 2.71563 4.81253 2.16563 5.56878 2.16563H16.4313C17.1532 2.16563 17.7719 2.71563 17.875 3.43751L19.5938 18.2531C19.6282 18.6656 19.4907 19.0438 19.2157 19.3531Z"
              fill=""
            />
            <path
              d="M14.3345 5.29375C13.922 5.39688 13.647 5.80938 13.7501 6.22188C13.7845 6.42813 13.8189 6.63438 13.8189 6.80625C13.8189 8.35313 12.547 9.625 11.0001 9.625C9.45327 9.625 8.1814 8.35313 8.1814 6.80625C8.1814 6.6 8.21577 6.42813 8.25015 6.22188C8.35327 5.80938 8.07827 5.39688 7.66577 5.29375C7.25327 5.19063 6.84077 5.46563 6.73765 5.87813C6.6689 6.1875 6.63452 6.49688 6.63452 6.80625C6.63452 9.2125 8.5939 11.1719 11.0001 11.1719C13.4064 11.1719 15.3658 9.2125 15.3658 6.80625C15.3658 6.49688 15.3314 6.1875 15.2626 5.87813C15.1595 5.46563 14.747 5.225 14.3345 5.29375Z"
              fill=""
            />
          </svg>
        </CardDataStats>
       
        <CardDataStats
         title="Vente" 
        total={bonLivraisonData.reduce((acc, bl) => acc + bl.prixTotalTTC, 0).toFixed(3) + " DT"} 
        rate={rateVente}
        levelUp>
         <GiHandTruck className="fill-primary dark:fill-white w-6 h-5 "/>
        </CardDataStats>
        <CardDataStats 
        title="Bénéfice"
         total={(bonLivraisonData.reduce((acc, bl) => acc + bl.prixTotalTTC, 0) - bonReceptionData.reduce((acc, br) => acc + br.prixTotalTTC, 0)).toFixed(3) + " DT"}
         rate={rateProfit} 
         levelUp>
          <PiMoneyWavyFill className="fill-primary dark:fill-white w-6 h-5 "/>
        </CardDataStats>
        <CardDataStats title="Clients" total={totalClients} rate={activeClientsPercent} rateMsg="Active/Mois" levelDown>
        <TfiUser className="fill-primary dark:fill-white w-6 h-5 " />
        </CardDataStats>

      
      </div>
       
     
      <div className="mt-4">
       {/* Assurez-vous que venteData et achatData sont correctement initialisés avant de passer à ChartOne */}
  {venteData && achatData && venteData.length > 0 && achatData.length > 0 && (
    <ChartOne venteData={venteData} achatData={achatData} />
  )}

      </div>
    </>
  );
};

