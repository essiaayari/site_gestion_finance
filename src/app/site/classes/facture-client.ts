import { Client } from "./client";

export class FactureClient {
    constructor(public idfc:string,
        public nom_client:string,
        public prenom_client:string,
        public description:string,
        public ref_facture:string,
        public statut:string,
        public methode_payement:string,
        public nom_banque:string,
        public adresse_banque:string,
        public titulaire_compte:string,
        public adresse_titulaire:string,
        public devise_compte:string,
        public IBAN:string,
        public swift_BIC:string,
        public routing:string,
        public activite:string,
        public montant_paye:number,
        public montant_restant:number,
        public net_ht:number,
        public tva:number,
        public nombre:number,
        public honoraire_h_ht:number,
        public totale_honoraire_ht:number,
        public timbre_fisc:number,
        public total_ttc:number,
        public montant_cheque:number,
        public nombre_cheque:number,
        public num_compte:number,
        public date_versement:Date,
        public idclient:Client["idc"],
        ){}

}