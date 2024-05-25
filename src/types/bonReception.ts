import { ProduitDataBon } from "./produits";

// Interface pour les données d'un bon de réception
export interface BonReceptionData {
  _id: string;
  fournisseur: string;
  produits: any[]; 
  prixTotalHT: number;
  montantTVA: number;
  prixTotalTTC: number;
  dateReception: string;
  idBonReception: number;
  userId: string;
  vehicle: string; 
  chauffeur: string; 
}

// Interface pour les données formatées d'un bon de réception
export interface BonReceptionFormatData {
  _id: string;
  fournisseur: string;
  prixTotalHT: number;
  montantTVA: number;
  prixTotalTTC: number;
  dateReception: string;
  idBonReception: number;
  userId: string;
  vehicle: string;
  chauffeur: string; 
}

// Interface pour créer un nouveau bon de réception
export interface BonReceptionDataCreate {
  fournisseur: string;
  produits: ProduitDataBon[]; 
  prixTotalHT: number;
  montantTVA: number;
  prixTotalTTC: number;
  dateReception: string;
  userId: string;
  vehicle: string; 
  chauffeur: string; 
}
