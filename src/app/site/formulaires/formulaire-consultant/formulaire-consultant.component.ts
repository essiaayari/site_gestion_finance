import { Component, ElementRef, Renderer2 } from '@angular/core';
import { Consultant } from '../../classes/consultant';
import { ConsultantService } from '../../services/consultant.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-formulaire-consultant',
  templateUrl: './formulaire-consultant.component.html',
  styleUrl: './formulaire-consultant.component.css'
})
export class FormulaireConsultantComponent {
  current_fs: HTMLElement | null = null;
  next_fs: HTMLElement | null = null;
  previous_fs: HTMLElement | null = null;
  opacity: number = 0;
  current: number = 1;
  steps: number = 0;
  selectedconsultant:any;

  consultantlist:Consultant[]=[];
  consultantobj:Consultant={
    idcons: '',
    nom: '',
    prenom: '',
    num_tel: '',
    adresse_mail: '',
    lieu_hab: '',
    civilite: '',
    ref_facture:'',
    type_consultant: '',
    id_unique:'',
    pays:'',
    region:'',
    code_postal:0
  }
  idcons:string='';
  nom:string='';
  prenom:string='';
  num_tel:string='';
  age:number=0;
  adress_mail:string='';
  lieu_hab:string='';
  civilite:string='';
  ref_facture:string='';
  type_consultant:string='';
  id_unique:string='';
pays:string='';
region:string='';
code_postal:number=0;

  showform: boolean = false;
    showform2: boolean = false;
  
  
  constructor(private consultantservice:ConsultantService,private afs:AngularFirestore, private renderer: Renderer2, private el: ElementRef,private modalService: NgbModal,private router:Router ){}
  
  
    ngOnInit(): void {
      this.getconsultant();
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
      const percent = (100 / this.steps) * curStep;
      this.renderer.setStyle(this.el.nativeElement.querySelector('.progress-bar'), 'width', percent + '%');
    }

  
    getconsultant() {
      this.consultantservice.getconsultant().subscribe(res => {
        this.consultantlist = res.map((e: any) => {
          const data = e.payload.doc.data();
          return {
            idcons: e.payload.doc.id,
            nom: data.nom,
            prenom: data.prenom,
            num_tel: data.num_tel,
            adresse_mail: data.adresse_mail,
            lieu_hab: data.lieu_hab,
            civilite: data.civilite,
            ref_facture: data.ref_facture,
            type_consultant:data.type_consultant,
          id_unique:data.id_unique,
          pays:data.pays,
          region:data.region,
          code_postal:data.code_postal
          };
        });
      }, err => {
        alert('error');
      });
    }
    
  
    addconsultant(){
      if(this.nom==''||this.prenom==''){
          alert('fill the inputs needed!')
      }
      this.consultantobj.idcons='';
      this.consultantobj.nom=this.nom;
      this.consultantobj.prenom=this.prenom;
      this.consultantobj.num_tel=this.num_tel;
      this.consultantobj.civilite=this.civilite;

      this.consultantobj.adresse_mail=this.adress_mail;
      this.consultantobj.lieu_hab=this.lieu_hab;
      this.consultantobj.ref_facture=this.ref_facture;
      this.consultantobj.type_consultant=this.type_consultant;
      this.consultantobj.id_unique=this.id_unique;
      this.consultantobj.pays=this.pays;
      this.consultantobj.region=this.region;
      this.consultantobj.code_postal=this.code_postal;

      this.consultantservice.addconsultant(this.consultantobj);
      this.resetform();
  
    }
    resetform(){
     this. idcons='';
     this.nom='';
     this.prenom='';
     this.num_tel='';
     this.adress_mail='';
     this.lieu_hab='';
     this.civilite='';
     this.ref_facture='';
     this.type_consultant='';
   this.id_unique='';
   this.pays='';
   this.region='';
   this.code_postal=0;
    }
   
  
    deleteconsultant(consultant:Consultant){
      if(window.confirm('are you sure that you want to delete'+consultant.nom+
      ''+consultant.prenom+'?'))
      this.consultantservice.deleteconsultant(consultant);
    }
  
    updateconsultant() {
      this.consultantobj.idcons = this.idcons;
      this.consultantobj.nom = this.nom;
      this.consultantobj.prenom = this.prenom;
      this.consultantobj.num_tel = this.num_tel;
      this.consultantobj.adresse_mail = this.adress_mail;
      this.consultantobj.lieu_hab = this.lieu_hab;
      this.consultantobj.civilite = this.civilite;
      this.consultantobj.ref_facture = this.ref_facture;
      this.consultantobj.type_consultant=this.type_consultant;
      this.consultantobj.id_unique=this.id_unique;
      this.consultantobj.pays=this.pays;
      this.consultantobj.region=this.region;
      this.consultantobj.code_postal=this.code_postal;
      this.consultantservice.updateconsultant(this.consultantobj);
    
      this.resetform();
      this.toggleForm2();
    }
    
  
  
  
    toggleForm() {
      this.showform = !this.showform;
    }
    toggleForm2() {
      this.showform2 = !this.showform2;
    }
    
    updateForm(consultant: Consultant) {
      this.idcons = consultant.idcons;
      this.nom = consultant.nom;
      this.prenom = consultant.prenom;
      this.num_tel = consultant.num_tel;
      this.adress_mail = consultant.adresse_mail;
      this.lieu_hab = consultant.lieu_hab;
      this.civilite = consultant.civilite;
      this.ref_facture = consultant.ref_facture;
      this.type_consultant = consultant.type_consultant;
      this.id_unique = consultant.id_unique;
      this.pays = consultant.pays;
      this.region = consultant.region;
      this.code_postal = consultant.code_postal;
      this.toggleForm2();
    }


    selectType(type: string): void {
      this.type_consultant = type;
    }

    additionalTypes: string[] = []; // Track additional types

    addMoreTypes(): void {
      const newType = prompt('Enter a new consultant type:'); // You can use a modal for a better user experience
      if (newType && !this.additionalTypes.includes(newType)) {
        this.additionalTypes.push(newType);
      }
    }

    closeForm() {
      this.modalService.dismissAll();
      this.router.navigate(['/consultants']);
    }
}
