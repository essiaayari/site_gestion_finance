import { Component, ElementRef, Input, Renderer2 } from '@angular/core';
import { StockService } from '../../services/stock.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Stock } from '../../classes/stock';
import { Router } from '@angular/router';

@Component({
  selector: 'app-formulaire-stock',
  templateUrl: './formulaire-stock.component.html',
  styleUrl: './formulaire-stock.component.css'
})
export class FormulaireStockComponent {
  current_fs: HTMLElement | null = null;
  next_fs: HTMLElement | null = null;
  previous_fs: HTMLElement | null = null;
  opacity: number = 0;
  current: number = 1;
  steps: number = 0;


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

constructor(private stockservice:StockService,private afs:AngularFirestore, private renderer: Renderer2, private el: ElementRef,public activeModal: NgbActiveModal,private modalService: NgbModal, 
  private router: Router ){}


  ngOnInit(): void {
    this.getstock();

    this.steps = this.el.nativeElement.querySelectorAll('fieldset').length;

    this.setProgressBar(this.current);

    this.renderer.listen(this.el.nativeElement, 'click', (event) => {
      if (event.target.classList.contains('next')) {
        this.current_fs = event.target.parentElement as HTMLElement;
        this.next_fs = this.current_fs.nextElementSibling as HTMLElement;

        // Add Class Active
        this.el.nativeElement
          .querySelectorAll('#progressbar li')[Array.from(this.el.nativeElement.querySelectorAll('fieldset')).indexOf(this.next_fs)]
          .classList.add('active');

        // Show the next fieldset
        if (this.next_fs) {
          this.renderer.setStyle(this.next_fs, 'display', 'block');
        }

        // Hide the current fieldset with style
        if (this.current_fs) {
          this.animateFieldset(this.current_fs, this.next_fs);
          this.setProgressBar(++this.current);
        }
      } else if (event.target.classList.contains('previous')) {
        this.current_fs = event.target.parentElement as HTMLElement;
        this.previous_fs = this.current_fs.previousElementSibling as HTMLElement;

        // Remove class active
        this.el.nativeElement
          .querySelectorAll('#progressbar li')[Array.from(this.el.nativeElement.querySelectorAll('fieldset')).indexOf(this.current_fs)]
          .classList.remove('active');

        // Show the previous fieldset
        if (this.previous_fs) {
          this.renderer.setStyle(this.previous_fs, 'display', 'block');
        }

        // Hide the current fieldset with style
        if (this.current_fs) {
          this.animateFieldset(this.current_fs, this.previous_fs);
          this.setProgressBar(--this.current);
        }
      } else if (event.target.classList.contains('submit')) {
        event.preventDefault(); // Prevent the default behavior of the submit button
      }
    });
  }
  animateFieldset(current_fs: HTMLElement, target_fs: HTMLElement | null): void {
    this.opacity = 0;

    this.renderer.setStyle(current_fs, 'opacity', '0');
    this.renderer.setStyle(current_fs, 'display', 'none');

    if (target_fs) {
      this.renderer.setStyle(target_fs, 'opacity', this.opacity.toString());
    }

    this.animateOpacity(target_fs);
  }

  animateOpacity(target_fs: HTMLElement | null): void {
    if (target_fs) {
      this.renderer.setStyle(target_fs, 'opacity', this.opacity.toString());
    }

    this.opacity += 0.01;

    if (this.opacity <= 1) {
      requestAnimationFrame(() => this.animateOpacity(target_fs));
    }
  }

  setProgressBar(curStep: number): void {
    const percent = (100 / this.steps) * curStep;
    this.renderer.setStyle(this.el.nativeElement.querySelector('.progress-bar'), 'width', percent + '%');
  }
  

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

  updateclient() {
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

  selectType(type: string): void {
    this.statut = type;
  }
  
  closeForm() {
    this.modalService.dismissAll();
    this.router.navigate(['/stock']);
  }
}
