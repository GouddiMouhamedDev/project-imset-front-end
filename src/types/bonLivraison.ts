import { ProduitDataBon } from "./produits";

export interface BonLivraisonData {
  _id: string;
  client: string;
  produits: any[]; 
  prixTotalHT: number;
  montantTVA: number;
  prixTotalTTC: number;
  dateLivraison: string;
  idBonLivraison: number;
  destination:string;
  userId:string;
  vehicle: string; 
  chauffeur: string; 
}

// Interface pour représenter les données d'un bon de livraison
export interface BonLivraisonFormatData {
  _id: string;
  client: string;
  prixTotalHT: number;
  montantTVA: number;
  prixTotalTTC: number;
  dateLivraison: string;
  idBonLivraison: number;
  destination:string;
  userId:string;
  vehicle: string;
  chauffeur: string; 
}

export interface BonLivraisonDataCreate {
  client: string;
  produits: ProduitDataBon[]; 
  prixTotalHT: number;
  montantTVA: number;
  prixTotalTTC: number;
  dateLivraison: string;
  destination:string;
  userId:string;
  vehicle: string; 
  chauffeur: string; 
}
