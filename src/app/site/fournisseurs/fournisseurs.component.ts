import { Component, ElementRef, Renderer2 } from '@angular/core';
import { Fournisseur } from '../classes/fournisseur';
import { FournisseurService } from '../services/fournisseur.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { FormulaireFournisseursComponent } from '../formulaires/formulaire-fournisseurs/formulaire-fournisseurs.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fournisseurs',
  templateUrl: './fournisseurs.component.html',
  styleUrl: './fournisseurs.component.css'
})
export class FournisseursComponent {
  // Pour le formulaire du fournisseur

  current_fs: HTMLElement | null = null;
  next_fs: HTMLElement | null = null;
  previous_fs: HTMLElement | null = null;
  opacity: number = 0;
  current: number = 1;
  steps: number = 0;
  currentStep: number = 1;

  selectedFournisseur: any;


   // Variables pour le contrôle d'affichage du formulaire

  showform: boolean = false;
    showform2: boolean = false;

  // Initialisation de la liste des fournisseur  et d'un objet client

  fournisseurlist:Fournisseur[]=[];
  fournisseurobj:Fournisseur={
    idf: '',
    nom: '',
    num_tel_ent: '',
    matricule_fisc:'',
    adresse: '',
    adresse_mail: '',
    ref_facture: '',
    nom_produit:'',
    site_web:'',
    civilite:'',
    pays:'',
    region:'',
    code_postal:0,
    ref:'',
    nom_pers:'',
    num_tel_pers:'',


  }

  // Déclaration des variables de formulaire
  idf:string='';
  nom:string='';
  num_tel_ent:string='';
  matricule_fisc:string='';
  adresse:string='';
  adresse_mail:string='';
  nom_produit:string='';
  ref_facture:string='';
  site_web:string='';
  civilite:string='';
  pays:string='';
  region:string='';
  code_postal:number=0;
  ref:string='';
  nom_pers:string='';
  num_tel_pers:string='';




  
  constructor(private fournisseurservice:FournisseurService,private afs:AngularFirestore,private renderer: Renderer2, private el: ElementRef,private modalService: NgbModal,private router: Router   ){}
  
  
    ngOnInit(): void {
      this.getfournisseur();

      // for the form pop up
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
    const progressBar = this.el.nativeElement.querySelector('.progress-bar');
    if (!progressBar) {
      console.error('Progress bar element not found');
      return;
    }
  
    const percent = (100 / this.steps) * curStep;
    this.renderer.setStyle(progressBar, 'width', percent + '%');
  }


  // methode get
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
    
  // methode add

    addfournisseur(){
      if(this.nom==''||this.matricule_fisc==''){
          alert('fill the inputs needed!')
      }
      this.fournisseurobj.idf='';
      this.fournisseurobj.nom=this.nom;
      this.fournisseurobj.num_tel_ent=this.num_tel_ent;
      this.fournisseurobj.matricule_fisc=this.matricule_fisc;
      this.fournisseurobj.adresse=this.adresse;
      this.fournisseurobj.adresse_mail=this.adresse_mail;
      this.fournisseurobj.ref_facture=this.ref_facture;
      this.fournisseurobj.nom_produit=this.nom_produit;
      this.fournisseurobj.site_web=this.site_web;
      this.fournisseurobj.civilite=this.civilite;
      this.fournisseurobj.pays=this.pays;
      this.fournisseurobj.region=this.region;
      this.fournisseurobj.code_postal=this.code_postal;
      this.fournisseurobj.ref=this.ref;
      this.fournisseurobj.nom_pers=this.nom_pers;
      this.fournisseurobj.num_tel_pers=this.num_tel_pers;

      this.fournisseurservice.addfournisseur(this.fournisseurobj);
      this.resetform();
  
    }
    resetform(){
     this.idf='';
     this.nom='';
     this.num_tel_ent='';
     this.matricule_fisc='';
     this.adresse='';
     this.adresse_mail='';
     this.nom_produit='';
     this.ref_facture='';
     this.site_web='';
     this. civilite='',
     this. pays='',
     this. region='',
     this.code_postal=0,
     this.ref='',
     this.nom_pers='',
     this.num_tel_pers=''



    }
   
  
    deletefournisseur(fournisseur:Fournisseur){
      if(window.confirm('are you sure that you want to delete'+fournisseur.nom+
      'avec la matricule fiscale'+fournisseur.matricule_fisc+'?'))
      this.fournisseurservice.deletefournisseur(fournisseur);
    }
  
    updatefournisseur() {
      this.fournisseurobj.idf=this.idf;
      this.fournisseurobj.nom=this.nom;
      this.fournisseurobj.num_tel_ent=this.num_tel_ent;
      this.fournisseurobj.matricule_fisc=this.matricule_fisc;
      this.fournisseurobj.adresse=this.adresse;
      this.fournisseurobj.adresse_mail=this.adresse_mail;
      this.fournisseurobj.ref_facture=this.ref_facture;
      this.fournisseurobj.nom_produit=this.nom_produit;
      this.fournisseurobj.site_web=this.site_web;
      this.fournisseurobj.civilite=this.civilite;
      this.fournisseurobj.pays=this.pays;
      this.fournisseurobj.region=this.region;
      this.fournisseurobj.code_postal=this.code_postal;
      this.fournisseurobj.ref=this.ref;
      this.fournisseurobj.nom_pers=this.nom_pers;
      this.fournisseurobj.num_tel_pers=this.num_tel_pers;

      this.fournisseurservice.updatefournisseur(this.fournisseurobj);
    
      this.resetform();
      this.toggleForm2();
    }
    
  
  
  
    toggleForm() {
      this.showform = !this.showform;
    }
    toggleForm2() {
      this.showform2 = !this.showform2;
    }
    
    updateForm(fournisseur: Fournisseur) {

      this.idf = fournisseur.idf;

      this.nom = fournisseur.nom;
      this.num_tel_ent = fournisseur.num_tel_ent;
      this.matricule_fisc = fournisseur.matricule_fisc;
      this.adresse = fournisseur.adresse;
      this.adresse_mail = fournisseur.adresse_mail;
      this.nom_produit = fournisseur.nom_produit;
      this.ref_facture = fournisseur.ref_facture;
      this.site_web = fournisseur.site_web;
      this.civilite = fournisseur.civilite;
      this.pays = fournisseur.pays;
      this.region = fournisseur.region;
      this.code_postal = fournisseur.code_postal;
      this.ref = fournisseur.ref;
      this.nom_pers = fournisseur.nom_pers;
      this.num_tel_pers = fournisseur.num_tel_pers;

    
      this.toggleForm2();
    }
    

    openfournisseurFormModal() {
      const modalOptions: NgbModalOptions = {
        size: 'lg' 
      };
    
      const modalRef = this.modalService.open(FormulaireFournisseursComponent, modalOptions);
      modalRef.componentInstance.clientData = this.selectedFournisseur;
    
      modalRef.result.then(
        (result) => {
          
        },
        (reason) => {

        }
      );
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
