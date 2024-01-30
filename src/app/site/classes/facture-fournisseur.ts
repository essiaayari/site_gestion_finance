export class FactureFournisseur {
    constructor(public idff:string,
        public ref_facture:string,
        public nom_fournisseur:string,
        public methode_payement:string,
        public type_produit:string,
        public nom_produit:string,
        public id_fournisseur:string,
        public total_net:number,
        public quantite_produit :number,
        public totale_honoraire_ht:number,
        public timbre_fisc:number,
        public total_ttc:number,
        ){}

}
