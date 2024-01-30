import { Component, ElementRef, Input, Renderer2 } from '@angular/core';
import { Client } from '../../classes/client';
import { ClientService } from '../../services/client.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-formulaire-client',
  templateUrl: './formulaire-client.component.html',
  styleUrl: './formulaire-client.component.css'
})
export class FormulaireClientComponent {
  // Pour le formulaire du client
  current_fs: HTMLElement | null = null;
  next_fs: HTMLElement | null = null;
  previous_fs: HTMLElement | null = null;
  opacity: number = 0;
  current: number = 1;
  steps: number = 0;


  // Variables pour le contrôle d'affichage du formulaire
  showform: boolean = false;
  showform2: boolean = false;
  

  d:Date=new Date;

  // Initialisation de la liste de clients et d'un objet client
  clientlist: Client[] = [];
  clientobj: Client = {
   idc: '',
  nom: '',
  prenom: '',
  num_tel: '',
  adresse_mail: '',
  lieu_hab: '',
  civilite: '',
  ref_facture: '',
  type_client: '',
  identifiant_unique: '',
  pays: '',
  region: '',
  code_postal: 0,
  workshop_title: '',
  workshop_db: this.d,
  workshop_df: this.d,
  birth_date: this.d,
  birth_place: '',
  profession: '',
  facebook: '',
  instagram: '',
  };

  // Déclaration des variables de formulaire
  idc: string = '';
  nom: string = '';
  prenom: string = '';
  num_tel: string = '';
  adress_mail: string = '';
  lieu_hab: string = '';
  civilite: string = '';
  ref_facture: string = '';
  type_client: string = '';
  identifiant_unique: string = '';
  pays: string = '';
  region: string = '';
  code_postal: number = 0;
  workshop_title: string='';
  workshop_db: Date=this.d;
  workshop_df: Date=this.d;
  birth_date: Date=this.d;
  birth_place: string='';
  profession: string='';
  facebook: string='';
  instagram: string='';

  constructor(
    private clientservice: ClientService,
    private afs: AngularFirestore,
    private renderer: Renderer2,
    private el: ElementRef,
    public activeModal: NgbActiveModal,private modalService: NgbModal,  private router: Router
  ) {}

  
  ngOnInit(): void {
// pour le formulaire du client
    // Initialisation du nombre d'étapes du formulaire
    this.steps = this.el.nativeElement.querySelectorAll('fieldset').length;

    // Initialisation de la barre de progression
    this.setProgressBar(this.current);

    
    this.renderer.listen(this.el.nativeElement, 'click', (event) => {
      if (event.target.classList.contains('next')) {
        // Gestion du bouton "Next:suivant"
        this.current_fs = event.target.parentElement as HTMLElement;
        this.next_fs = this.current_fs.nextElementSibling as HTMLElement;

        // Ajout de la classe "active" à l'étape suivante dans la barre de progression
        this.el.nativeElement
          .querySelectorAll('#progressbar li')[Array.from(this.el.nativeElement.querySelectorAll('fieldset')).indexOf(this.next_fs)]
          .classList.add('active');

        // Affichage de l'étape suivante
        if (this.next_fs) {
          this.renderer.setStyle(this.next_fs, 'display', 'block');
        }

        // Masquage de l'étape actuelle avec une animation de transition
        if (this.current_fs) {
          this.animateFieldset(this.current_fs, this.next_fs);
          this.setProgressBar(++this.current);
        }
      } else if (event.target.classList.contains('previous')) {
        // Gestion du bouton "Previous:précendent"
        this.current_fs = event.target.parentElement as HTMLElement;
        this.previous_fs = this.current_fs.previousElementSibling as HTMLElement;

        // Suppression de la classe "active" de l'étape actuelle dans la barre de progression
        this.el.nativeElement
          .querySelectorAll('#progressbar li')[Array.from(this.el.nativeElement.querySelectorAll('fieldset')).indexOf(this.current_fs)]
          .classList.remove('active');

        // Affichage de l'étape précédente
        if (this.previous_fs) {
          this.renderer.setStyle(this.previous_fs, 'display', 'block');
        }

        // Masquage de l'étape actuelle avec une animation de transition
        if (this.current_fs) {
          this.animateFieldset(this.current_fs, this.previous_fs);
          this.setProgressBar(--this.current);
        }
      } else if (event.target.classList.contains('submit')) {
        // Gestion du bouton "Submit"
        event.preventDefault(); 
      }
    });
  }
// Pour la navigation entre les étapes du formulaire 
  // Fonction pour animer la transition entre les étapes du formulaire
  animateFieldset(current_fs: HTMLElement, target_fs: HTMLElement | null): void {
    this.opacity = 0;

    this.renderer.setStyle(current_fs, 'opacity', '0');
    this.renderer.setStyle(current_fs, 'display', 'none');

    if (target_fs) {
      this.renderer.setStyle(target_fs, 'opacity', this.opacity.toString());
    }

    this.animateOpacity(target_fs);
  }

  // Fonction pour animer l'opacité des étapes du formulaire
  animateOpacity(target_fs: HTMLElement | null): void {
    if (target_fs) {
      this.renderer.setStyle(target_fs, 'opacity', this.opacity.toString());
    }

    this.opacity += 0.01;

    if (this.opacity <= 1) {
      requestAnimationFrame(() => this.animateOpacity(target_fs));
    }
  }

  // Fonction pour mettre à jour la barre de progression
  setProgressBar(curStep: number): void {
    const percent = (100 / this.steps) * curStep;
    this.renderer.setStyle(this.el.nativeElement.querySelector('.progress-bar'), 'width', percent + '%');
  }


  // Fonction pour ajouter un client
  addclient(){
    if(this.nom==''||this.prenom==''){
        alert('fill the inputs needed!')
    }
    this.clientobj.idc='';
    this.clientobj.nom=this.nom;
    this.clientobj.prenom=this.prenom;
    this.clientobj.num_tel=this.num_tel;
    this.clientobj.adresse_mail=this.adress_mail;
    this.clientobj.lieu_hab=this.lieu_hab;
    this.clientobj.ref_facture=this.ref_facture;
    this.clientobj.type_client=this.type_client;
    this.clientobj.identifiant_unique=this.identifiant_unique;
    this.clientobj.pays=this.pays;
    this.clientobj.region=this.region;
    this.clientobj.code_postal=this.code_postal;
    this.clientobj.workshop_title=this.workshop_title;
    this.clientobj.workshop_db=this.workshop_db;
    this.clientobj.workshop_df=this.workshop_df;
    this.clientobj.birth_date=this.birth_date;
    this.clientobj.birth_place=this.birth_place;
    this.clientobj.profession=this.profession;
    this.clientobj.facebook=this.facebook;
    this.clientobj.instagram=this.instagram;

    this.clientservice.addclient(this.clientobj);
    this.resetform();

  }

  // Fonction pour réinitialiser le formulaire
  resetform(){
    this. idc='';
    this.nom='';
    this.prenom='';
    this.num_tel='';
    this.adress_mail='';
    this.lieu_hab='';
    this.civilite='';
    this.ref_facture='';
    this.type_client='';
    this.identifiant_unique='';
    this.pays='';
    this.region='';
    this.code_postal=0;
    this.workshop_title= '';
    this.workshop_db= this.d;
    this.workshop_df= this.d;
    this.birth_date= this.d;
    this.birth_place= '';
    this.profession= '';
    this.facebook= '';
    this.instagram= '';
   }
  

  // Fonction pour mettre à jour un client

  // Fonction pour basculer l'affichage du formulaire
  toggleForm() {
    this.showform = !this.showform;
  }

  // Fonction pour basculer l'affichage du deuxième formulaire
  toggleForm2() {
    this.showform2 = !this.showform2;
  }


  
  // Fonction pour sélectionner le type de client
  selectType(type: string): void {
    this.type_client = type;
  }


  closeForm() {
    this.modalService.dismissAll();
    this.router.navigate(['/clients']);
  }

  
}