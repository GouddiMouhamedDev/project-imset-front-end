export interface ProduitData {
    
  quantite: number;
 produit: string;
 idProduit: number;
 nom: string;
 stock: number;
 prixUnitaireHT: number;
 tauxTVA: number;
 prixUnitaireTTC: number;

}

export interface ProduitDataBon  {
produit: string;
 idProduit: number;
 nom: string;
 prixUnitaireHT: number;
 tauxTVA: number;
 prixUnitaireTTC: number;
 quantite: number;
 montantTTC : number;

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