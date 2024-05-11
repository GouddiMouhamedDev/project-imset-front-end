export interface ClientData {
    _id: string;
    nom: string;
    telephone?: string;
    identifiantFiscaleClient: string;
    destination: string;
    solde: number;
  }
  

export interface ClientFormatData {

  Id: string;
  Nom: string;
  Telephone?: string;
  IdentifiantFiscale: string;
  Destination: string;
  Solde: number;

}


export interface ApiClientData{
  _id: string;
  nom: string;
  telephone?: string;
  identifiantFiscaleClient: string;
  destination: string;
  solde: number;
  idClient: string;




}