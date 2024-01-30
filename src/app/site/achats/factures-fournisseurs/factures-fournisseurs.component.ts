import { Component } from '@angular/core';
import { FactureFournisseur } from '../../classes/facture-fournisseur';
import { FactureFournisseurService } from '../../services/facture-fournisseur.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { FormulaireFactureFourniseurComponent } from '../../formulaires/formulaire-facture-fourniseur/formulaire-facture-fourniseur.component';

@Component({
  selector: 'app-factures-fournisseurs',
  templateUrl: './factures-fournisseurs.component.html',
  styleUrl: './factures-fournisseurs.component.css'
})
export class FacturesFournisseursComponent {

  showModal = false;
  selectedfournisseurfacture: any;
  d:Date=new Date();
  FactureFournisseurlist:FactureFournisseur[]=[];
  FactureFournisseurobj:FactureFournisseur={
    idff: '',
    ref_facture: '',
    nom_fournisseur: '',
    methode_payement: '',
    type_produit: '',
    nom_produit: '',
    id_fournisseur: '',
    total_net: 0,
    quantite_produit: 0,
    totale_honoraire_ht: 0,
    timbre_fisc: 0,
    total_ttc: 0
  }

 // Déclaration des variables de formulaire
    idff:string= '';
    ref_facture:string= '';
    nom_fournisseur:string= '';
    methode_payement:string= '';
    type_produit:string= '';
    nom_produit:string= '';
    id_fournisseur:string= '';
    total_net:number=0;
    quantite_produit:number=0;
    totale_honoraire_ht:number=0;
    timbre_fisc:number=0;
    total_ttc:number=0;
  
 
  showform: boolean = false;
    showform2: boolean = false;
  
  
  constructor(private sfacture_fournisseur:FactureFournisseurService,private afs:AngularFirestore,     private modalService: NgbModal,
    ){}
  
  
    ngOnInit(): void {
      this.getfacture_fournisseur();
  
    }
  
   getfacture_fournisseur() {
        this.sfacture_fournisseur.getFactureFournisseur().subscribe(res => {
          this.FactureFournisseurlist = res.map((e: any) => {
            const data = e.payload.doc.data();
            const fournisseurdata = data.fournisseurlist ? data.fournisseurlist[0] : null;  // Assuming clientList is an array
            return {
              idff: e.payload.doc.id,
              ref_facture: data.ref_facture,
              nom_fournisseur: fournisseurdata && fournisseurdata.nom ? fournisseurdata.nom : '',
              methode_payement: data.methode_payement,
              type_produit: data.type_produit,
              nom_produit: data.nom_produit,
              id_fournisseur: data.id_fournisseur,
              total_net: data.total_net,
              quantite_produit: data.quantite_produit,
              totale_honoraire_ht: data.totale_honoraire_ht,
              timbre_fisc: data.timbre_fisc,
              total_ttc: data.total_ttc,

  
            };
          });
         
      },
      (err) => {
        alert('error');
      }
    );
      }
    
  
    
    resetform(){
      this. idff='';
      this.ref_facture='';
      this.nom_fournisseur='';
      this.methode_payement='';
      this.type_produit='';
      this.nom_produit='';
      this.id_fournisseur='';
      this.total_net=0;
      this.quantite_produit=0;
      this.totale_honoraire_ht=0;
      this.timbre_fisc=0;
      this.total_ttc=0;
    }
   
  
    deletefacture_fournisseur(facture_fournisseur:FactureFournisseur){
      if(window.confirm('are you sure that you want to delete'+facture_fournisseur.ref_facture+
      'for the client '+facture_fournisseur.nom_fournisseur+'?'))
      this.sfacture_fournisseur.deleteFactureFournisseur(facture_fournisseur);
    }
  
    updatefacture_fournisseur() {

      this.FactureFournisseurobj.idff=this.idff;
      this.FactureFournisseurobj.ref_facture = this.ref_facture;
      this.FactureFournisseurobj.nom_fournisseur = this.nom_fournisseur;
      this.FactureFournisseurobj.methode_payement = this.methode_payement;
      this.FactureFournisseurobj.type_produit = this.type_produit;
      this.FactureFournisseurobj.nom_produit = this.nom_produit;
      this.FactureFournisseurobj.id_fournisseur = this.id_fournisseur;
      this.FactureFournisseurobj.total_net = this.total_net;
      this.FactureFournisseurobj.quantite_produit = this.quantite_produit;
      this.FactureFournisseurobj.totale_honoraire_ht = this.totale_honoraire_ht;
      this.FactureFournisseurobj.timbre_fisc = this.timbre_fisc;
      this.FactureFournisseurobj.total_ttc = this.total_ttc;

      this.sfacture_fournisseur.updatefacture_fournisseur(this.FactureFournisseurobj);
    
      this.resetform();
      this.toggleForm2();
    }
    
  
  
  
    toggleForm() {
      this.showform = !this.showform;
    }
    toggleForm2() {
      this.showform2 = !this.showform2;
    }
    
    updateForm(facture_fournisseur: FactureFournisseur) {
      this.idff = facture_fournisseur.idff;
      this. ref_facture = facture_fournisseur. ref_facture;
      this. nom_fournisseur = facture_fournisseur. nom_fournisseur;
      this.methode_payement = facture_fournisseur.methode_payement;
      this.type_produit = facture_fournisseur.type_produit;
      this.nom_produit = facture_fournisseur.nom_produit;
      this.id_fournisseur = facture_fournisseur.id_fournisseur;
      this.total_net = facture_fournisseur.total_net;
      this.quantite_produit = facture_fournisseur.quantite_produit;  
      this.totale_honoraire_ht = facture_fournisseur.totale_honoraire_ht;
      this.timbre_fisc = facture_fournisseur.timbre_fisc;
      this.total_ttc = facture_fournisseur.total_ttc;

    
      this.toggleForm2();
    }

    openClientfactureFormModal() {
      const modalOptions: NgbModalOptions = {
        size: 'xl' 
      };
    
      const modalRef = this.modalService.open(FormulaireFactureFourniseurComponent, modalOptions);
      modalRef.componentInstance.clientData = this.selectedfournisseurfacture;
    
      modalRef.result.then(
        (result) => {
          
        },
        (reason) => {
        }
      );
    }
}
