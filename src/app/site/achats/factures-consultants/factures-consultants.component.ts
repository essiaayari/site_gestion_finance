import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FactureConsultant } from '../../classes/facture-consultant';
import { FactureConsultantService } from '../../services/facture-consultant.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { FormulaireFactureConsultantComponent } from '../../formulaires/formulaire-facture-consultant/formulaire-facture-consultant.component';

@Component({
  selector: 'app-factures-consultants',
  templateUrl: './factures-consultants.component.html',
  styleUrl: './factures-consultants.component.css'
})
export class FacturesConsultantsComponent {
  showModal = false;
  selectedconsultantfacture: any;
  facture_consultantlist:FactureConsultant[]=[];
  facture_consultanttobj:FactureConsultant={
    idfcons: '',
    nom_consultant: '',
    prenom_consultant: '',
    description: '',
    ref_facture: '',
    activite: '',
    statut: '',
    methode_payement: '',
    honoraires: 0,
    nombre: 0,
    honoraire_h_ht: 0,
    totale_honoraire_ht: 0,
    timbre_fisc: 0,
    total_ttc: 0,
    idfournisseur: ''
  }
  idfcons:string='';
  nom_consultant:string='';
  prenom_consultant:string='';
  description:string='';
  ref_facture:string='';
  activite:string='';
  statut:string='';
  methode_payement:string='';
  honoraires:number=0;
  nombre:number=0;
  honoraire_h_ht:number=0;
  totale_honoraire_ht:number=0;
  timbre_fisc:number=0;
  total_ttc:number=0;
  idfournisseur:string='';


  showform: boolean = false;
    showform2: boolean = false;
  
  
  constructor(private facture_consultant:FactureConsultantService,
    private afs:AngularFirestore,
    private modalService: NgbModal ){}
  
  
    ngOnInit(): void {
      this.getfacture_consultant();
  
    }
  
    getfacture_consultant() {
      this.facture_consultant.getfacture_consultant().subscribe(res => {
        this.facture_consultantlist = res.map((e: any) => {
          const data = e.payload.doc.data();
          return {
            idfcons: e.payload.doc.id,
            nom_consultant: data.nom_consultant,
            prenom_consultant: data.prenom_consultant,
            description: data.description,
            ref_facture: data.ref_facture,
            activite: data.activite,
            statut: data.statut,
            methode_payement: data.methode_payement,
            honoraires: data.honoraires,
            nombre: data.nombre,
            honoraire_h_ht: data.honoraire_h_ht,
            totale_honoraire_ht: data.totale_honoraire_ht,
            timbre_fisc: data.timbre_fisc,
            total_ttc: data.total_ttc,
            idfournisseur: data.idfournisseur,

            

          };
        });
      }, err => {
        alert('error');
      });
    }
    
  
  
    resetform(){
     this. idfcons='';
     this.nom_consultant='';
     this.prenom_consultant='';
     this.description='';
     this.ref_facture='';
     this.activite='';
     this.statut='';
     this.methode_payement='';
     this.honoraires= 0;
     this.nombre= 0;
     this.honoraire_h_ht= 0;
     this.totale_honoraire_ht= 0;
     this.timbre_fisc= 0;
     this.total_ttc= 0;
     this.idfournisseur='';
    }
   
  
    deletefacture_consultant(facture_consultant:FactureConsultant){
      if(window.confirm('are you sure that you want to delete'+facture_consultant.ref_facture+
      'for the client '+facture_consultant.nom_consultant+' '+facture_consultant.prenom_consultant+'?'))
      this.facture_consultant.deletefacture_consultant(facture_consultant);
    }
  
    updatefacture_consultant() {

      this.facture_consultanttobj.idfcons=this.idfcons;
      this.facture_consultanttobj.nom_consultant=this.nom_consultant;
      this.facture_consultanttobj.prenom_consultant=this.prenom_consultant;
      this.facture_consultanttobj.description=this.description;
      this.facture_consultanttobj.ref_facture=this.ref_facture;
      this.facture_consultanttobj.activite=this.activite;
      this.facture_consultanttobj.statut=this.statut;
      this.facture_consultanttobj.methode_payement=this.methode_payement;
      this.facture_consultanttobj.honoraires=this.honoraires;
      this.facture_consultanttobj.nombre=this.nombre;
      this.facture_consultanttobj.honoraire_h_ht=this.honoraire_h_ht;
      this.facture_consultanttobj.totale_honoraire_ht=this.totale_honoraire_ht;
      this.facture_consultanttobj.timbre_fisc=this.timbre_fisc;
      this.facture_consultanttobj.total_ttc=this.total_ttc;
      this.facture_consultanttobj.idfournisseur=this.idfournisseur;

      this.facture_consultant.updatefacture_consultant(this.facture_consultanttobj);
    
      this.resetform();
      this.toggleForm2();
    }
    
  
  
  
    toggleForm() {
      this.showform = !this.showform;
    }
    toggleForm2() {
      this.showform2 = !this.showform2;
    }
    
    updateForm(facture_consultant: FactureConsultant) {
      // Set the client data to the form fields
      this.idfcons = facture_consultant.idfcons;
      this.nom_consultant = facture_consultant.nom_consultant;
      this.prenom_consultant = facture_consultant.prenom_consultant;
      this. description = facture_consultant. description;
      this. ref_facture = facture_consultant. ref_facture;
      this.statut = facture_consultant.statut;
      this.methode_payement = facture_consultant.methode_payement;
      this.honoraires = facture_consultant.honoraires;
      this.nombre = facture_consultant.nombre;
      this.honoraire_h_ht = facture_consultant.honoraire_h_ht;
      this.totale_honoraire_ht = facture_consultant.totale_honoraire_ht;
      this.timbre_fisc = facture_consultant.timbre_fisc;
      this.total_ttc = facture_consultant.total_ttc;
      this.idfournisseur = facture_consultant.idfournisseur;

      // Show the update form
      this.toggleForm2();
    }


    openConsultantfactureFormModal() {
      const modalOptions: NgbModalOptions = {
        size: 'xl' 
      };
    
      const modalRef = this.modalService.open(FormulaireFactureConsultantComponent, modalOptions);
      modalRef.componentInstance.clientData = this.selectedconsultantfacture;
    
      modalRef.result.then(
        (result) => {
          
        },
        (reason) => {
        }
      );
    }
    
}
