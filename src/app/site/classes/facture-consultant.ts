import { Fournisseur } from "./fournisseur";

export class FactureConsultant {
   
    constructor(public idfcons:string,
        public nom_consultant:string,
        public prenom_consultant:string,
        public description:string,
        public ref_facture:string,
        public activite:string,
        public statut:string,
        public methode_payement:string,
        public honoraires:number,
        public nombre:number,
        public honoraire_h_ht:number,
        public totale_honoraire_ht:number,
        public timbre_fisc:number,
        public total_ttc:number,
        public idfournisseur:Fournisseur["idf"],

        ){}

}
