import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FactureClient } from '../../classes/facture-client';
import { FactureClientService } from '../../services/facture-client.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { FormulaireFactureClientComponent } from '../../formulaires/formulaire-facture-client/formulaire-facture-client.component';
import { Client } from '../../classes/client';
import { ActivatedRoute } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { CompanyData } from '../../classes/company-data';
import { CompanyDataService } from '../../services/company-data.service';

@Component({
  selector: 'app-facture-clients',
  templateUrl: './facture-clients.component.html',
  styleUrl: './facture-clients.component.css'
})
export class FactureClientsComponent {
  current_fs: HTMLElement | null = null;
  next_fs: HTMLElement | null = null;
  previous_fs: HTMLElement | null = null;
  opacity: number = 0;
  current: number = 1;
  steps: number = 0;
  
  showModal = false;
  selectedClientfacture: any;

  d:Date=new Date();
  data_company:CompanyData[]=[];
  


  facture_clientlist:FactureClient[]=[];
  facture_clientobj:FactureClient={
    idfc: '',
    nom_client: '',
    prenom_client: '',
    description: '',
    ref_facture: '',
    statut: '',
    methode_payement: '',
    nom_banque: '',
    adresse_banque: '',
    titulaire_compte: '',
    adresse_titulaire: '',
    devise_compte: '',
    IBAN: '',
    swift_BIC: '',
    routing: '',
    activite: '',
    montant_paye: 0,
    montant_restant: 0,
    net_ht: 0,
    tva: 0,
    nombre: 0,
    honoraire_h_ht: 0,
    totale_honoraire_ht: 0,
    timbre_fisc: 0,
    total_ttc: 0,
    montant_cheque: 0,
    nombre_cheque: 0,
    num_compte: 0,
    date_versement: this.d,
    idclient: ''
  }
  idfc:string='';
  nom_client:string='';
  prenom_client:string='';
  description:string='';
  ref_facture:string='';
  statut:string='';
  methode_payement:string='';
  nom_banque:string='';
  adresse_banque:string='';
  titulaire_compte:string='';
  adresse_titulaire:string='';
  devise_compte:string='';
  IBAN:string='';
  swift_BIC:string='';
  routing:string='';
  activite:string='';
  montant_paye:number=0;
  montant_restant:number=0;
  net_ht:number=0;
  tva:number=0;
  nombre:number=0;
  honoraire_h_ht:number=0;
  totale_honoraire_ht:number=0;
  timbre_fisc:number=0;
  total_ttc:number=0;
  montant_cheque:number=0;
  nombre_cheque:number=0;
  num_compte:number=0;
  date_versement:Date=this.d;
  idclient:string='';

  showform: boolean = false;
    showform2: boolean = false;
  
    clientId!: string;
    clientInfo: any; 
  
    selectedClientId: string = '';
  selectedClient: Client | undefined;
  clientList: Client[] = [];

  constructor(private facture_clientservice:FactureClientService,
    private companyservice:CompanyDataService,
    private afs:AngularFirestore,
    private renderer: Renderer2,
     private el: ElementRef,
     private modalService: NgbModal,
     private route:ActivatedRoute,
     private clientservice:ClientService ){}
  // pour l'importation du nom du client
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
      this.getfacture_client();
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
    getfacture_client() {
      this.facture_clientservice.getfacture_client().subscribe(res => {
        this.facture_clientlist = res.map((e: any) => {
          const data = e.payload.doc.data();
          const clientData = data.clientList ? data.clientList[0] : null;  // Assuming clientList is an array
          return {
            idfc: e.payload.doc.id,
           nom_client: clientData && clientData.nom ? clientData.nom : '',
          prenom_client: clientData && clientData.prenom ? clientData.prenom : '',
          description: data.description,
            ref_facture: data.ref_facture,
            statut: data.statut,
            methode_payement: data.methode_payement,
            nom_banque: data.nom_banque,
            adresse_banque: data.adresse_banque,
            titulaire_compte: data.titulaire_compte,
            adresse_titulaire: data.adresse_titulaire,
            devise_compte: data.devise_compte,
            IBAN: data.IBAN,
            swift_BIC: data.swift_BIC,
            routing: data.routing,
            activite: data.activite,
            montant_paye: data. montant_paye,
            montant_restant: data.montant_restant,
            net_ht: data.net_ht,
            tva:data.tva,
            nombre: data.nombre,
            honoraire_h_ht: data.honoraire_h_ht,
            totale_honoraire_ht: data.totale_honoraire_ht,
            timbre_fisc: data.timbre_fisc,
            total_ttc: data.total_ttc,
            montant_cheque:data.montant_cheque,
            nombre_cheque:data.nombre_cheque,
            num_compte:data.num_compte,
            date_versement:data.date_versement,
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
      this. idfc='';
      this.ref_facture='';
      this.nom_client='';
      this.prenom_client='';
      this.description='';
      this. ref_facture='';
      this. statut='';
      this.methode_payement='';
      this. nom_banque='';
      this. adresse_banque='';
      this. titulaire_compte='';
      this. adresse_titulaire='';
      this. devise_compte='';
      this. IBAN='';
      this. swift_BIC='';
      this. routing='';
      this. activite='';
      this. montant_paye= 0;
      this. montant_restant= 0;
      this. net_ht= 0;
      this.  tva= 0;
      this. nombre= 0;
      this. honoraire_h_ht= 0;
      this. totale_honoraire_ht= 0;
      this. timbre_fisc= 0;
      this. total_ttc= 0;
      this. montant_cheque= 0;
      this. nombre_cheque= 0;
      this. num_compte= 0;
      this. date_versement= this.d;
      this.  idclient='';
 
     }
   
  
    deletefacture_client(facture_client:FactureClient){
      if(window.confirm('are you sure that you want to delete'+facture_client.ref_facture+'?'))
      this.facture_clientservice.deletefacture_client(facture_client);
    }
  
    updatefacture_client() {
      this.facture_clientobj.idfc=this.idfc;
      this.facture_clientobj.nom_client=this.nom_client;
      this.facture_clientobj.prenom_client=this.prenom_client;
      this.facture_clientobj.description=this.description;
      this.facture_clientobj.ref_facture=this.ref_facture;
      this.facture_clientobj.statut=this.statut;
      this.facture_clientobj.methode_payement=this.methode_payement;

      this.facture_clientobj.nom_banque=this.nom_banque;
      this.facture_clientobj.adresse_banque=this.adresse_banque;
      this.facture_clientobj.titulaire_compte=this.titulaire_compte;
      this.facture_clientobj.adresse_titulaire=this.adresse_titulaire;
      this.facture_clientobj.devise_compte=this.devise_compte;
      this.facture_clientobj.IBAN=this.IBAN;
      this.facture_clientobj.swift_BIC=this.swift_BIC;
      this.facture_clientobj.routing=this.routing;
      this.facture_clientobj.activite=this.activite;
      this.facture_clientobj.montant_paye=this.montant_paye;
      this.facture_clientobj.montant_restant=this.montant_restant;
      this.facture_clientobj.net_ht=this.net_ht;
      this.facture_clientobj.tva=this.tva;

      this.facture_clientobj.nombre=this.nombre;
      this.facture_clientobj.honoraire_h_ht=this.honoraire_h_ht;
      this.facture_clientobj.totale_honoraire_ht=this.totale_honoraire_ht;
      this.facture_clientobj.timbre_fisc=this.timbre_fisc;
      this.facture_clientobj.total_ttc=this.total_ttc;
      this.facture_clientobj.montant_cheque=this.montant_cheque;

      this.facture_clientobj.nombre_cheque=this.nombre_cheque;
      this.facture_clientobj.num_compte=this.num_compte;
      this.facture_clientobj.date_versement=this.date_versement;
      this.facture_clientobj.idclient=this.idclient;

      this.facture_clientservice.updatefacture_client(this.facture_clientobj);
    
      this.resetform();
      this.toggleForm2();
    }
  
  
  
    toggleForm() {
      this.showform = !this.showform;
    }
    toggleForm2() {
      this.showform2 = !this.showform2;
    }
    
    updateForm(facture_client: FactureClient) {
      this.idfc = facture_client.idfc;
      this. nom_client = facture_client. nom_client;
      this. prenom_client = facture_client. prenom_client;
      this. description = facture_client. description;
      this. ref_facture = facture_client. ref_facture;
      this.statut = facture_client.statut;
      this.methode_payement = facture_client.methode_payement;
      this.nom_banque = facture_client.nom_banque;
      this.adresse_banque = facture_client.adresse_banque;
      this.titulaire_compte = facture_client.titulaire_compte;
      this.adresse_titulaire = facture_client.adresse_titulaire;
      this.devise_compte = facture_client.devise_compte;
      this.IBAN = facture_client.IBAN;
      this.swift_BIC = facture_client.swift_BIC;
      this.activite = facture_client.activite;
      this.montant_paye = facture_client.montant_paye;
      this.montant_restant = facture_client.montant_restant;
      this.methode_payement = facture_client.methode_payement;
      this.net_ht = facture_client.net_ht;
      this.tva = facture_client.tva;
      this.nombre = facture_client.nombre;
      this.honoraire_h_ht = facture_client.honoraire_h_ht;
      this.totale_honoraire_ht = facture_client.totale_honoraire_ht;
      this.timbre_fisc = facture_client.timbre_fisc;
      this.total_ttc = facture_client.total_ttc;
      this.montant_cheque = facture_client.montant_cheque;
      this.nombre_cheque = facture_client.nombre_cheque;
      this.num_compte = facture_client.num_compte;
      this.date_versement = facture_client.date_versement;
      this.idclient = facture_client.idclient;

      this.toggleForm2();
    }



    showDetails: boolean = false;

    toggleDetails() {
      this.showDetails = !this.showDetails;
    }

    openClientfactureFormModal() {
      const modalOptions: NgbModalOptions = {
        size: 'xl' 
      };
    
      const modalRef = this.modalService.open(FormulaireFactureClientComponent, modalOptions);
      modalRef.componentInstance.clientData = this.selectedClientfacture;
    
      modalRef.result.then(
        (result) => {
          
        },
        (reason) => {
        }
      );
    }
}
