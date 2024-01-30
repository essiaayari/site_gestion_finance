export class ChequeTraite {
    constructor(public idch_t:string,
        public Mode:string,
        public type:string,
        public nom_client:string,
        public nom_fournisseur:string,
        public nom_banque:string,
        public compte_source:string,
        public montant_cheque:number,
        public nombre_cheque:number,
        public nombre_traite:number,
        public date_echeance:Date,
        public date_reglement:Date,
        public num_cheque:number,
        public montant_traite:number,
        public num_traite:number,




       ){}

}


