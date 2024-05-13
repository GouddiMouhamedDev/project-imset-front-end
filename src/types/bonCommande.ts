export interface BonCommandeData {
    _id: string;
    client: string;
    produits: any[]; // Vous devrez définir une interface pour les produits
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