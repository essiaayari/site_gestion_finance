import { Component, ElementRef, EventEmitter, Renderer2 } from '@angular/core';
import { CompanyData } from '../../classes/company-data';
import { FournisseurService } from '../../services/fournisseur.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Fournisseur } from '../../classes/fournisseur';
import { CompanyDataService } from '../../services/company-data.service';
import { FactureFournisseurService } from '../../services/facture-fournisseur.service';
import { FactureFournisseur } from '../../classes/facture-fournisseur';

@Component({
  selector: 'app-formulaire-facture-fourniseur',
  templateUrl: './formulaire-facture-fourniseur.component.html',
  styleUrl: './formulaire-facture-fourniseur.component.css'
})
export class FormulaireFactureFourniseurComponent {
  currentDate: Date = new Date();
  d:Date=new Date();
  data_company:CompanyData[]=[];

  facture_fournisseurlist:FactureFournisseur[]=[];
  facture_fournisseurobj:FactureFournisseur={
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

 constructor(private fournisseurservice:FournisseurService,
  private afs:AngularFirestore,
  private renderer: Renderer2, 
  private el: ElementRef,
  private modalService: NgbModal,
  private router: Router,
  private companyservice:CompanyDataService,
     private facture_fournisseur_service:FactureFournisseurService,
    private  sfacture_fournisseur: FactureFournisseurService ){}


  showform: boolean = false;
    showform2: boolean = false;
  
    fournisseurid!: string;
    fournisseurinfo: any; 
  
    selectedfournisseur: Fournisseur | undefined;
    fournisseurlist: Fournisseur[] = [];
    selectedfournisseurid = '';


  
    onfournisseurchange() {
      console.log('fournisseurlist:', this.fournisseurlist);
      console.log('Selected fournisseur ID:', this.selectedfournisseurid);
      this.selectedfournisseur = this.getfournisseurbyId(this.selectedfournisseurid);
      console.log('Selected fournisseur:', this.selectedfournisseur);
    }
    
    
    getfournisseurbyId(fournisseurid: string): Fournisseur | undefined {
      return this.fournisseurlist.find(Fournisseur => Fournisseur.idf === fournisseurid);
    }
    
      ngOnInit(): void {
        this.getfacture_fournisseur();
        this.getfournisseur();
  this.getcompanydata();
  
  
       
      }
  
      getcompanydata(){
        this.companyservice.getcampanydata().subscribe(res=>{
          this.data_company=res.map((e:any)=>{
            const data=e.payload.doc.data();
            return{
              mail:data.mail,
              num_tel:data.num_tel,
              adresse1:data.adresse1,
              adresse2:data.adresse2,
              adresse3:data.adresse3,
  
            }
          })
        }, err => {
          alert('error');
        })
      }
  
      getfournisseur() {
        this.fournisseurservice.getfournisseur().subscribe(res => {
          this.fournisseurlist = res.map((e: any) => {
            const data = e.payload.doc.data();
            return {
              idf: e.payload.doc.id,
              nom: data.nom,
              num_tel_ent: data.num_tel_ent,
              matricule_fisc:data.matricule_fisc,
              adresse:data.adresse,
              adresse_mail:data.adresse_mail,
              ref_facture: data.ref_facture,
              nom_produit:data.nom_produit,
              site_web:data.site_web,
              civilite:data.civilite,
              pays:data.pays,
              region:data.region,
              code_postal:data.code_postal,
              ref:data.ref,
              nom_pers:data.nom_pers,
              num_tel_pers:data.num_tel_pers,
  
  
            };
          });
        }, err => {
          alert('error');
        });
      }
     
      
      getfacture_fournisseur() {
        this.facture_fournisseur_service.getFactureFournisseur().subscribe(
          (res) => {
            this.facture_fournisseurlist = res.map((e: any) => {
              const data = e.payload.doc.data();
              const fournisseurdata = data.fournisseurlist ? data.fournisseurlist[0] : null;
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
      
      factureFournisseurAdded: EventEmitter<FactureFournisseur> = new EventEmitter<FactureFournisseur>();

      addfacture_fournisseur(){
        if(this.ref_facture==''){
            alert('fill the inputs needed!')
        }
    this.facture_fournisseurobj.idff = '';
    this.facture_fournisseurobj.ref_facture = this.ref_facture;
    this.facture_fournisseurobj.nom_fournisseur = this.nom_fournisseur;
    this.facture_fournisseurobj.methode_payement = this.methode_payement;
    this.facture_fournisseurobj.type_produit = this.type_produit;
    this.facture_fournisseurobj.nom_produit = this.nom_produit;
    this.facture_fournisseurobj.id_fournisseur = this.id_fournisseur;
    this.facture_fournisseurobj.total_net = this.total_net;
    this.facture_fournisseurobj.quantite_produit = this.quantite_produit;
    this.facture_fournisseurobj.totale_honoraire_ht = this.totale_honoraire_ht;
    this.facture_fournisseurobj.timbre_fisc = this.timbre_fisc;
    this.facture_fournisseurobj.total_ttc = this.total_ttc;

    this.factureFournisseurAdded.emit(this.facture_fournisseurobj);

    this.facture_fournisseur_service.addFactureFournisseur(this.facture_fournisseurobj);
    this.resetform();
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
        if(window.confirm('are you sure that you want to delete'+facture_fournisseur.ref_facture+'?'))
        this.facture_fournisseur_service.deleteFactureFournisseur(facture_fournisseur);
      }
    
      updatefacture_fournisseur() {
        this.facture_fournisseurobj.idff=this.idff;
        this.facture_fournisseurobj.ref_facture = this.ref_facture;
        this.facture_fournisseurobj.nom_fournisseur = this.nom_fournisseur;
        this.facture_fournisseurobj.methode_payement = this.methode_payement;
        this.facture_fournisseurobj.type_produit = this.type_produit;
        this.facture_fournisseurobj.nom_produit = this.nom_produit;
        this.facture_fournisseurobj.id_fournisseur = this.id_fournisseur;
        this.facture_fournisseurobj.total_net = this.total_net;
        this.facture_fournisseurobj.quantite_produit = this.quantite_produit;
        this.facture_fournisseurobj.totale_honoraire_ht = this.totale_honoraire_ht;
        this.facture_fournisseurobj.timbre_fisc = this.timbre_fisc;
        this.facture_fournisseurobj.total_ttc = this.total_ttc;
        this.facture_fournisseur_service.updatefacture_fournisseur(this.facture_fournisseurobj);
      
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
  
  
     
  
      showDetails: boolean = false;
  
      toggleDetails() {
        this.showDetails = !this.showDetails;
      }
  
     


}
