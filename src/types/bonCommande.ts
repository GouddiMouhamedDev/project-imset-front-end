import { ProduitDataBon } from "./produits";

export interface BonCommandeData {
  _id: string;
  client: string;
  produits: any[]; 
  prixTotalHT: number;
  montantTVA: number;
  prixTotalTTC: number;
  dateCommande: string;
  idBonCommande: number;
  destination:string;
  userId:string;
}




// Interface pour représenter les données d'un bon de commande
export interface BonCommandeFormatData {
  _id: string;
  client: string;
  prixTotalHT: number;
  montantTVA: number;
  prixTotalTTC: number;
  dateCommande: string;
  idBonCommande: number;
  destination:string;
  userId:string;
}  


export interface BonCommandeDataCreate {
  client: string;
  produits: ProduitDataBon[]; 
  prixTotalHT: number;
  montantTVA: number;
  prixTotalTTC: number;
  dateCommande: string;
  destination:string;
  userId:string;
}