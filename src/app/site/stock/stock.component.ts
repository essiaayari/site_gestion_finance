import { Component, ElementRef, Renderer2 } from '@angular/core';
import { Stock } from '../classes/stock';
import { StockService } from '../services/stock.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { FormulaireStockComponent } from '../formulaires/formulaire-stock/formulaire-stock.component';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.css'
})
export class StockComponent {
  current_fs: HTMLElement | null = null;
  next_fs: HTMLElement | null = null;
  previous_fs: HTMLElement | null = null;
  opacity: number = 0;
  current: number = 1;
  steps: number = 0;
  currentStep: number = 1;

  selectedstock:any;
  stocklist:Stock[]=[];
  stockobj:Stock={
    idstock: '',
    nom_produit: '',
    quantite_total: 0,
    quantite_restante: 0,
    prix_unitaire: 0,
    prix_total: 0,
    ref_service: '',
    statut: ''
  
  }
  idstock:string='';
  nom_produit:string='';
  quantite_total:number=0;
  quantite_restante:number=0;
  prix_unitaire:number=0;
  prix_total:number=0;
  ref_service:string='';
  statut:string='';
 
  
  
  showform: boolean = false;
    showform2: boolean = false;
  
  
  constructor(private stockservice:StockService,private afs:AngularFirestore, private renderer: Renderer2, private el: ElementRef,private modalService: NgbModal ){}
  
  
    ngOnInit(): void {
      this.getstock();
    }

    // methode get
  getstock() {
    this.stockservice.getstock().subscribe(res => {
      this.stocklist = res.map((e: any) => {
        const data = e.payload.doc.data();
        return {
          idstock: e.payload.doc.id,
          nom_produit: data.nom_produit,
          quantite_total: data.quantite_total,
          quantite_restante: data.quantite_restante,
          prix_unitaire: data.prix_unitaire,
          prix_total: data.prix_total,
          ref_service: data.ref_service,
          statut: data.statut

        };
      });
    }, err => {
      alert('error');
    });
  }
  
// methode add

  addstock(){
    if(this.nom_produit==''){
        alert('fill the inputs needed!')
    }
    this.stockobj.idstock='';
    this.stockobj.nom_produit=this.nom_produit;
    this.stockobj.quantite_total=this.quantite_total;
    this.stockobj.quantite_restante=this.quantite_restante;
    this.stockobj.prix_unitaire=this.prix_unitaire;
    this.stockobj.prix_total=this.prix_total;
    this.stockobj.ref_service=this.ref_service;
    this.stockobj.statut=this.statut;


    this.stockservice.addstock(this.stockobj);
    this.resetform();

  }
  resetform(){
   this. idstock='';
   this.nom_produit='';
   this.quantite_total=0;
   this.quantite_restante=0;
   this.prix_unitaire=0;
   this.prix_total=0;
   this.ref_service='';
   this.statut='';
   
  
  }
 
// methode delete

  deletestock(stock:Stock){
    if(window.confirm('are you sure that you want to delete'+stock.nom_produit+'?'))
    this.stockservice.deletestock(stock);
  }
// methode update

  updatestock() {
    this.stockobj.idstock=this.idstock;
    this.stockobj.nom_produit=this.nom_produit;
    this.stockobj.quantite_total=this.quantite_total;
    this.stockobj.quantite_restante=this.quantite_restante;
    this.stockobj.prix_unitaire=this.prix_unitaire;
    this.stockobj.prix_total=this.prix_total;
    this.stockobj.ref_service=this.ref_service;
    this.stockobj.statut=this.statut;
    this.stockservice.updatestock(this.stockobj);
  
    this.resetform();
    this.toggleForm2();
  }
  



  toggleForm() {
    this.showform = !this.showform;
  }
  toggleForm2() {
    this.showform2 = !this.showform2;
  }
  
  updateForm(stock: Stock) {
    this.idstock = stock.idstock;
    this.nom_produit = stock.nom_produit;
    this.quantite_total = stock.quantite_total;
    this.quantite_restante = stock.quantite_restante;
    this.prix_unitaire = stock.prix_unitaire;
    this.prix_total = stock.prix_total;
    this.ref_service = stock.ref_service;
    this.statut = stock.statut;
   

    this.toggleForm2();
  }
  


  openstockFormModal() {
    const modalOptions: NgbModalOptions = {
      size: 'lg' 
    };
  
    const modalRef = this.modalService.open(FormulaireStockComponent, modalOptions);
    modalRef.componentInstance.clientData = this.selectedstock;
  
    modalRef.result.then(
      (result) => {
        
      },
      (reason) => {
      }
    );
  }

  selectType(type: string): void {
    this.statut = type;
  }

  nextStep() {
    // Add any form validation logic if needed
    this.currentStep++;
  }

  previousStep() {
    // Add any form validation logic if needed
    this.currentStep--;
  }
}
