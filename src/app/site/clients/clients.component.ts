import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Client } from '../classes/client';
import { ClientService } from '../services/client.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { FormulaireClientComponent } from '../formulaires/formulaire-client/formulaire-client.component';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent implements OnInit {
   // Pour le formulaire du client
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
  selectedClient: any;
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
  instagram: ''

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

constructor(private clientservice:ClientService,
  private afs:AngularFirestore,
   private renderer: Renderer2,
    private el: ElementRef,
    private modalService: NgbModal,
    private authService:AuthService,
    private cdr: ChangeDetectorRef ){}


ngOnInit(): void {
  this.getclient();
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
  getclient() {
    this.clientservice.getclients().subscribe(res => {
      this.clientlist = res.map((e: any) => {
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
  
// methode add

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
   this. workshop_title= '';
   this. workshop_db= this.d;
   this.  workshop_df= this.d;
   this. birth_date= this.d;
   this.  birth_place= '';
   this. profession= '';
   this.  facebook= '';
   this.  instagram= '';
  }
 
// methode delete

async deleteclient(client: Client) {
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

  if (window.confirm('Are you sure that you want to delete ' + client.nom + ' ' + client.prenom + '?')) {
    this.clientservice.deleteclients(client);

    // Manually trigger change detection
    this.cdr.detectChanges();
  }
}


// methode update

updateclient() {
  const updatedClient: Client = {
    idc: this.idc,
    nom: this.nom,
    prenom: this.prenom,
    num_tel: this.num_tel,
    adresse_mail: this.adress_mail,
    lieu_hab: this.lieu_hab,
    civilite: this.civilite,
    ref_facture: this.ref_facture,
    type_client: this.type_client,
    identifiant_unique: this.identifiant_unique,
    pays: this.pays,
    region: this.region,
    code_postal: this.code_postal,
    workshop_title: this.workshop_title,
    workshop_db: this.workshop_db,
    workshop_df: this.workshop_df,
    birth_date: this.birth_date,
    birth_place: this.birth_place,
    profession: this.profession,
    facebook: this.facebook,
    instagram: this.instagram,

  };

  this.clientservice.updateclients(updatedClient)
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
  
  updateForm(client: Client) {
    this.idc = client.idc;
    this.nom = client.nom;
    this.prenom = client.prenom;
    this.num_tel = client.num_tel;
    this.adress_mail = client.adresse_mail;
    this.lieu_hab = client.lieu_hab;
    this.civilite = client.civilite;
    this.ref_facture = client.ref_facture;
    this.type_client = client.type_client;
    this.identifiant_unique = client.identifiant_unique;
    this.pays = client.pays;
    this.region = client.region;
    this.workshop_title = client.workshop_title;
    this.workshop_db = client.workshop_db;
    this.workshop_df = client.workshop_df;
    this.birth_date = client.birth_date;
    this.birth_place = client.birth_place;
    this.profession = client.profession;
    this.facebook = client.facebook;
    this.instagram = client.instagram;

    this.toggleForm2();
  }
  


  openClientFormModal() {
    const modalOptions: NgbModalOptions = {
      size: 'lg' 
    };
  
    const modalRef = this.modalService.open(FormulaireClientComponent, modalOptions);
    modalRef.componentInstance.clientData = this.selectedClient;
  
    modalRef.result.then(
      (result) => {
        
      },
      (reason) => {
      }
    );
  }
  selectType(type: string): void {
    this.type_client = type;
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
