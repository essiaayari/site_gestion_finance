import { Component, ElementRef, Renderer2 } from '@angular/core';
import { Devis } from '../../classes/devis';
import { DevisService } from '../../services/devis.service';
import { CompanyDataService } from '../../services/company-data.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { Client } from '../../classes/client';
import { CompanyData } from '../../classes/company-data';
import { FormulaireDevisComponent } from '../../formulaires/formulaire-devis/formulaire-devis.component';

@Component({
  selector: 'app-devis',
  templateUrl: './devis.component.html',
  styleUrl: './devis.component.css'
})
export class DevisComponent {
  data_company:CompanyData[]=[];
  selectedevis:any;
  devis_list:Devis[]=[];
  devis_obj:Devis={
    iddev: '',
    nom_client: '',
    prenom_client: '',
    description: '',
    ref_facture: '',
    net_ht: 0,
    tva: 0,
    nombre: 0,
    honoraire_h_ht: 0,
    totale_honoraire_ht: 0,
    timbre_fisc: 0,
    total_ttc: 0,
    idclient: ''
  }
  iddev:string= '';
  nom_client:string= '';
  prenom_client: string='';
  description:string= '';
  ref_facture: string='';
  net_ht:number=0;
  tva:number=0;
  nombre:number=0;
  honoraire_h_ht:number=0;
  totale_honoraire_ht:number=0;
  timbre_fisc:number=0;
  total_ttc:number=0;
  idclient:string= '';

  showform: boolean = false;
    showform2: boolean = false;
  
    clientId!: string;
    clientInfo: any; 
  
    selectedClientId: string = '';
  selectedClient: Client | undefined;
  clientList: Client[] = [];

  constructor(private devisservice:DevisService,
    private companyservice:CompanyDataService,
    private afs:AngularFirestore,
     private modalService: NgbModal,
     private route:ActivatedRoute,
     private clientservice:ClientService ){}


     onClientChange() {
      console.log('Selected client ID:', this.selectedClientId);
      // Assuming you have a method to fetch the selected client based on selectedClientId
      this.selectedClient = this.getClientById(this.selectedClientId);
      console.log('Selected client:', this.selectedClient);
    }
    
    getClientById(clientId: string): Client | undefined {
      // Assuming clientList is an array of Client objects
      return this.clientList.find(client => client.idc === clientId);
    }
    
    ngOnInit(): void {
      this.getdevis();
      this.getclient();
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
    getclient() {
      this.clientservice.getclients().subscribe(res => {
        this.clientList = res.map((e: any) => {
          const data = e.payload.doc.data();
          return {
            idc: e.payload.doc.id,
            nom: data.nom,
            prenom: data.prenom,
            num_tel: data.num_tel,
            adresse_mail: data.adresse_mail,
            lieu_hab: data.lieu_hab,
            civilite: data.civilite,
            ref_facture: data.ref_facture,
            type_client:data.type_client,
            identifiant_unique:data.identifiant_unique,
            pays:data.pays,
            region:data.region,
            code_postal:data.code_postal,
            workshop_title:data.workshop_title,
            workshop_db:data.workshop_db,
            workshop_df:data.workshop_df,
            birth_date:data.birth_date,
            birth_place:data.birth_place,
            profession:data.profession,
            facebook:data.facebook,
            instagram:data.code_postal,
  
          };
        });
      }, err => {
        alert('error');
      });
    }
    getClientName(clientId: string, property: 'nom' | 'prenom'): string | undefined {
      const client = this.clientList.find(c => c.idc === clientId);
      return client ? client[property] : undefined;
    }

    getdevis() {
      this.devisservice.getdevis().subscribe(res => {
        this.devis_list = res.map((e: any) => {
          const data = e.payload.doc.data();
          const clientData = data.clientList ? data.clientList[0] : null;  // Assuming clientList is an array
          return {
            iddev: e.payload.doc.id,
           nom_client: clientData && clientData.nom ? clientData.nom : '',
          prenom_client: clientData && clientData.prenom ? clientData.prenom : '',
          description: data.description,
            ref_facture: data.ref_facture,
           
            net_ht: data.net_ht,
            tva:data.tva,
            nombre: data.nombre,
            honoraire_h_ht: data.honoraire_h_ht,
            totale_honoraire_ht: data.totale_honoraire_ht,
            timbre_fisc: data.timbre_fisc,
            total_ttc: data.total_ttc,
           
            idclient:data.idclient,





          };
        });
       
    },
    (err) => {
      alert('error');
    }
  );
    }
    
    resetform(){
      this. iddev='';
      this.ref_facture='';
      this.nom_client='';
      this.prenom_client='';
      this.description='';
      this. ref_facture='';
     
      this. net_ht= 0;
      this.  tva= 0;
      this. nombre= 0;
      this. honoraire_h_ht= 0;
      this. totale_honoraire_ht= 0;
      this. timbre_fisc= 0;
      this. total_ttc= 0;
      
      this.  idclient='';
 
     }

     deletedevis(devis:Devis){
      if(window.confirm('are you sure that you want to delete'+devis.ref_facture+'?'))
      this.devisservice.deletedevis(devis);
    }
  
    updatedevis() {
      this.devis_obj.iddev=this.iddev;
      this.devis_obj.nom_client=this.nom_client;
      this.devis_obj.prenom_client=this.prenom_client;
      this.devis_obj.description=this.description;
      this.devis_obj.ref_facture=this.ref_facture;
   
      this.devis_obj.net_ht=this.net_ht;
      this.devis_obj.tva=this.tva;

      this.devis_obj.nombre=this.nombre;
      this.devis_obj.honoraire_h_ht=this.honoraire_h_ht;
      this.devis_obj.totale_honoraire_ht=this.totale_honoraire_ht;
      this.devis_obj.timbre_fisc=this.timbre_fisc;
      this.devis_obj.total_ttc=this.total_ttc;

      
      this.devis_obj.idclient=this.idclient;

      this.devisservice.updatedevis(this.devis_obj);
    
      this.resetform();
      this.toggleForm2();
    }
    
    toggleForm() {
      this.showform = !this.showform;
    }
    toggleForm2() {
      this.showform2 = !this.showform2;
    }

    updateForm(devis: Devis) {
      this.iddev = devis.iddev;
      this. nom_client = devis. nom_client;
      this. prenom_client = devis. prenom_client;
      this. description = devis. description;
      this. ref_facture = devis. ref_facture;
      this.net_ht = devis.net_ht;
      this.tva = devis.tva;
      this.nombre = devis.nombre;
      this.honoraire_h_ht = devis.honoraire_h_ht;
      this.totale_honoraire_ht = devis.totale_honoraire_ht;
      this.timbre_fisc = devis.timbre_fisc;
      this.total_ttc = devis.total_ttc;
      this.idclient = devis.idclient;

      this.toggleForm2();
    }
    showDetails: boolean = false;

    toggleDetails() {
      this.showDetails = !this.showDetails;
    }

    opendevisFormModal() {
      const modalOptions: NgbModalOptions = {
        size: 'xl' 
      };
    
      const modalRef = this.modalService.open(FormulaireDevisComponent, modalOptions);
      modalRef.componentInstance.clientData = this.selectedevis;
    
      modalRef.result.then(
        (result) => {
          
        },
        (reason) => {
        }
      );
    }
}
