import { Client } from "./client";

export class Devis {
    constructor(public iddev:string,
        public nom_client:string,
        public prenom_client:string,
        public description:string,
        public ref_facture:string,
        public net_ht:number,
        public tva:number,
        public nombre:number,
        public honoraire_h_ht:number,
        public totale_honoraire_ht:number,
        public timbre_fisc:number,
        public total_ttc:number,
        public idclient:Client["idc"],
        ){}
}
