export interface ProduitData {
    
     quantité: number;
    produit: string;
    idProduit: number;
    nom: string;
    stock: number;
    prixUnitaireHT: number;
    tauxTVA: number;
    prixUnitaireTTC: number;
  
  }

  export interface ProduitDataBon extends ProduitData {
    quantite: number;
    montantTTC : number
  }
  export interface ProduitFormatData {
    Id: string;
    idProduit: number;
    nom: string;
    stock: number;
    prixUnitaireHT: number;
    tauxTVA: number;
    prixUnitaireTTC: number;
  }
