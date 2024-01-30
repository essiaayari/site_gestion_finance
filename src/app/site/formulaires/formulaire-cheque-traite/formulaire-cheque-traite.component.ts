import { ChangeDetectorRef, Component, ElementRef, Renderer2 } from '@angular/core';
import { ChequeTraite } from '../../classes/cheque-traite';
import { ChequeTraiteService } from '../../services/cheque-traite.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../../services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-formulaire-cheque-traite',
  templateUrl: './formulaire-cheque-traite.component.html',
  styleUrl: './formulaire-cheque-traite.component.css'
})
export class FormulaireChequeTraiteComponent {
   // Pour le formulaire
   current_fs: HTMLElement | null = null;
   next_fs: HTMLElement | null = null;
   previous_fs: HTMLElement | null = null;
   opacity: number = 0;
   current: number = 1;
   steps: number = 0;
   currentStep: number = 1;

 
   // Variables pour le contrôle d'affichage du formulaire
   showform: boolean = false;
   showform2: boolean = false;
   
 
  showModal = false;
  d:Date=new Date;
  // Initialisation de la liste de clients et d'un objet client
  cheque_traitelist: ChequeTraite[] = [];
  cheque_traiteobj: ChequeTraite = {
    idch_t: '',
    Mode: '',
    type: '',
    nom_client: '',
    nom_fournisseur: '',
    nom_banque: '',
    compte_source: '',
    montant_cheque: 0,
    nombre_cheque: 0,
    nombre_traite: 0,
    date_echeance: this.d,
    date_reglement: this.d,
    num_cheque: 0,
    montant_traite: 0,
    num_traite: 0
  };
  
  // Déclaration des variables de formulaire
  idc: string = '';
  idch_t:string = '';
  Mode: string = '';
  type: string = '';
  nom_client:string = '';
  nom_fournisseur:string = '';
  nom_banque:string = '';
  compte_source:string = '';
  montant_cheque:number= 0;
  nombre_cheque:number= 0;
  nombre_traite:number= 0;
  date_echeance: Date=this.d;
  date_reglement: Date=this.d;
  num_cheque: number= 0;
  montant_traite: number= 0;
  num_traite: number= 0;
  
  constructor(private cheque_traiteservice:ChequeTraiteService,
    private afs:AngularFirestore,
     private renderer: Renderer2,
      private el: ElementRef,
      private modalService: NgbModal,
      private authService:AuthService,
      private cdr: ChangeDetectorRef ){}
  
  
  ngOnInit(): void {
    this.getcheque_traite();
  
  
  // pour le formulaire 
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
      const progressBar = this.el.nativeElement.querySelector('.progress-bar');
      if (!progressBar) {
        console.error('Progress bar element not found');
        return;
      }
    
      const percent = (100 / this.steps) * curStep;
      this.renderer.setStyle(progressBar, 'width', percent + '%');
    }
  
  
    async isEmployee(uid: string): Promise<boolean> {
      const userRole = await this.authService.getUserRole(uid);
      return userRole === 'employee';
    }
    // Updated method to check if the user is an admin
    async isAdmin(uid: string): Promise<boolean> {
      const userRole = await this.authService.getUserRole(uid);
      return userRole === 'admin';
    }
    
  
  
  
  // methode get
    getcheque_traite() {
      this.cheque_traiteservice.getcheque_traite().subscribe(res => {
        this.cheque_traitelist = res.map((e: any) => {
          const data = e.payload.doc.data();
          return {
            idch_t: e.payload.doc.id,
            Mode: data.Mode,
            type: data.type,
            nom_client: data.nom_client,
            nom_fournisseur: data.nom_fournisseur,
            nom_banque: data.nom_banque,   
            compte_source: data.compte_source,
            montant_cheque: data.montant_cheque,
            nombre_cheque: data.nombre_cheque,
            nombre_traite: data.nombre_traite,
            date_echeance:data.date_echeance,
            date_reglement:data.date_reglement,
            num_cheque:data.num_cheque,
            montant_traite:data.montant_traite,
            num_traite:data.num_traite,
          
          };
        });
      }, err => {
        alert('error');
      });
    }
    
  // methode add
  
    addcheque_traite(){
      if(this.type==''||this.Mode==''){
          alert('fill the inputs needed!')
      }
      this.cheque_traiteobj.idch_t='';
      this.cheque_traiteobj.Mode=this.Mode;
      this.cheque_traiteobj.type=this.type;
      this.cheque_traiteobj.nom_client=this.nom_client;
      this.cheque_traiteobj.nom_fournisseur=this.nom_fournisseur;
      this.cheque_traiteobj.nom_banque=this.nom_banque;
      this.cheque_traiteobj.compte_source=this.compte_source;
      this.cheque_traiteobj.montant_cheque=this.montant_cheque;
      this.cheque_traiteobj.nombre_cheque=this.nombre_cheque;
      this.cheque_traiteobj.nombre_traite=this.nombre_traite;
      this.cheque_traiteobj.date_echeance=this.date_echeance;
      this.cheque_traiteobj.date_reglement=this.date_reglement;
      this.cheque_traiteobj.num_cheque=this.num_cheque;
      this.cheque_traiteobj.montant_traite=this.montant_traite;
      this.cheque_traiteobj.num_traite=this.num_traite;
      
  
      this.cheque_traiteservice.addcheque_traite(this.cheque_traiteobj);
      this.resetform();
  
    }
    resetform(){
     this. idc='';
     this.idch_t='';
     this.Mode='';
     this.type='';
     this.nom_client='';
     this.nom_fournisseur='';
     this. nom_banque='';
     this. compte_source='';
     this. montant_cheque= 0;
     this. nombre_cheque= 0;
     this. nombre_traite= 0;
     this. date_echeance= this.d;
     this. date_reglement= this.d;
     this. num_cheque= 0;
     this. montant_traite= 0;
     this. num_traite= 0;
    }
   
  // methode delete
  
  async deletecheque_traite(cheque_traite: ChequeTraite) {
    const currentUserID = await this.authService.getCurrentUserId();
  
    if (currentUserID === null) {
      // Handle the case where the current user ID is null (not authenticated)
      console.error('User is not authenticated.');
      return;
    }
  
    const isAdmin = await this.isAdmin(currentUserID);
  
    if (!isAdmin) {
      // If the user is not an admin, show a message or handle accordingly
      alert('You do not have permission to delete clients.'); // Customize as needed
      return;
    }
  
    if (window.confirm('Are you sure that you want to delete ' + cheque_traite.nom_client + '?')) {
      this.cheque_traiteservice.deletecheque_traite(cheque_traite);
  
      // Manually trigger change detection
      this.cdr.detectChanges();
    }
  }
  
  
  // methode update
  
  updatecheque_traite() {
    const updatedcheque_traite: ChequeTraite = {
      idch_t: this.idch_t,
      Mode: this.Mode,
      type: this.type,
      nom_client: this.nom_client,
      nom_fournisseur: this.nom_fournisseur,
      nom_banque: this.nom_banque,
      compte_source: this.compte_source,
      montant_cheque: this.montant_cheque,
      nombre_cheque: this.nombre_cheque,
      nombre_traite: this.nombre_traite,
      date_echeance: this.date_echeance,
      date_reglement: this.date_reglement,
      num_cheque: this.num_cheque,
      montant_traite: this.montant_traite,
      num_traite: this.num_traite,
   
  
    };
  
    this.cheque_traiteservice.updatecheque_traite(updatedcheque_traite)
      .then(() => {
        // Client updated successfully
        console.log('Client updated successfully');
        // Add any other logic you want to perform after a successful update
      })
      .catch((error) => {
        // Handle the error
        console.error('Error updating client:', error);
        // Add any error handling logic you want
      });
  }
    
  
  
  
    toggleForm() {
      this.showform = !this.showform;
    }
    toggleForm2() {
      this.showform2 = !this.showform2;
    }
    
    updateForm(cheque_traite: ChequeTraite) {
      this.idch_t = cheque_traite.idch_t;
      this.Mode = cheque_traite.Mode;
      this.type = cheque_traite.type;
      this.nom_client = cheque_traite.nom_client;
      this.nom_fournisseur = cheque_traite.nom_fournisseur;
      this.nom_banque = cheque_traite.nom_banque;
      this.compte_source = cheque_traite.compte_source;
      this.montant_cheque = cheque_traite.montant_cheque;
      this.nombre_cheque = cheque_traite.nombre_cheque;
      this.nombre_traite = cheque_traite.nombre_traite;
      this.date_echeance = cheque_traite.date_echeance;
      this.date_reglement = cheque_traite.date_reglement;
      this.num_cheque = cheque_traite.num_cheque;
      this.montant_traite = cheque_traite.montant_traite;
      this.num_traite = cheque_traite.num_traite;
      
  
      this.toggleForm2();
    }
    
  
  
   
    selectType(type: string): void {
      this.type = type;
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
