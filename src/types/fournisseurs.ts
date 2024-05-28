export interface FournisseurData {
    Id: string;
    idFournisseur: number;
    Nom: string;
    telephone?:string;
    IdentifiantFiscale:string;
  }
  

  

  export interface ApiFournisseurData {
    _id: string;
    nom: string;
    telephone?:string;
    identifiantFiscaleFournisseur:string;
    idFournisseur: number;

  }