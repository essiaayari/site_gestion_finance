import { Component, ElementRef, Renderer2 } from '@angular/core';
import { Service } from '../classes/service';
import { ServiceService } from '../services/service.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { FormulaireServiceComponent } from '../formulaires/formulaire-service/formulaire-service.component';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrl: './service.component.css'
})
export class ServiceComponent {

  current_fs: HTMLElement | null = null;
  next_fs: HTMLElement | null = null;
  previous_fs: HTMLElement | null = null;
  opacity: number = 0;
  current: number = 1;
  steps: number = 0;
  currentStep: number = 1;

  showModal = false;
  selectedservice: any;


  servicelist:Service[]=[];
  d:Date=new Date("dd/MM/yyyy");

  serviceobj:Service={
    ids: '',
    nom_service: '',
    type_service: '',
    prix_unitaire: 0,
    tva: 0,
    prix_total: 0,
    date_debut: this.d,
    date_fin: this.d,
    nb_heures: 0,
    nb_participants:0,
  }
  ids:string='';
  nom_service:string='';
  type_service:string='';
  prix_unitaire:number=0;
  tva:number=0;
  prix_total:number=0;
  date_debut:Date=this.d;
  date_fin:Date=this.d;
  nb_heures:number=0;
  nb_participants:number=0;

  
  showform: boolean = false;
    showform2: boolean = false;
  
  
  constructor(private sservice:ServiceService,private afs:AngularFirestore, private renderer: Renderer2, private el: ElementRef,private modalService: NgbModal){}
  
  
    ngOnInit(): void {
      this.getservice();

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

    getservice() {
      this.sservice.getservice().subscribe(res => {
        this.servicelist = res.map((e: any) => {
          const data = e.payload.doc.data();
          return {
            ids: e.payload.doc.id,
            nom_service: data.nom_service,
            type_service: data.type_service,
            prix_unitaire: data.prix_unitaire,
            tva: data.tva,
            prix_total: data.prix_total,
            date_debut: data.date_debut,
            date_fin: data.date_fin,
            nb_heures: data.nb_heures,
            nb_participants: data.nb_participants,
          };
        });
      }, err => {
        alert('error');
      });
    }
    
  
    addservice(){
      if(this.nom_service==''){
          alert('fill the inputs needed!')
      }
      this.serviceobj.ids='';
      this.serviceobj.nom_service=this.nom_service;
      this.serviceobj.type_service=this.type_service;
      this.serviceobj.prix_unitaire=this.prix_unitaire;
      this.serviceobj.tva=this.tva;
      this.serviceobj.prix_total=this.prix_total;

      this.serviceobj.date_debut=this.date_debut;
      this.serviceobj.date_fin=this.date_fin;
      this.serviceobj.nb_heures=this.nb_heures;
      this.serviceobj.nb_participants=this.nb_participants;

      this.sservice.addservice(this.serviceobj);
      this.resetform();
  
    }
    resetform(){
     this. ids='';
     this.nom_service='';
     this.type_service='';
     this.prix_unitaire=0;
     this.tva=0;
     this.prix_total=0;
     this.date_debut=this.d;
     this.date_fin=this.d;
     this.nb_heures=0;
     this.nb_participants=0;

    }
   
  
    deleteservice(service:Service){
      if(window.confirm('are you sure that you want to delete'+service.nom_service+
      +'?'))
      this.sservice.deleteservice(service);
    }
  
    updateservice() {
      // Update the client using the idc property
      this.serviceobj.ids=this.ids;
      this.serviceobj.nom_service=this.nom_service;
      this.serviceobj.type_service=this.type_service;
      this.serviceobj.prix_unitaire=this.prix_unitaire;
      this.serviceobj.tva=this.tva;
      this.serviceobj.prix_total=this.prix_total;

      this.serviceobj.date_debut=this.date_debut;
      this.serviceobj.date_fin=this.date_fin;
      this.serviceobj.nb_heures=this.nb_heures;
      this.serviceobj.nb_participants=this.nb_participants;
    
      this.sservice.updateservice(this.serviceobj);
    
      this.resetform();
      this.toggleForm2();
    }
    
  
  
  
    toggleForm() {
      this.showform = !this.showform;
    }
    toggleForm2() {
      this.showform2 = !this.showform2;
    }
    
    updateForm(service: Service) {
      this.ids = service.ids;
      this.nom_service = service.nom_service;
      this.type_service = service.type_service;
      this.prix_unitaire = service.prix_unitaire;
      this.tva = service.tva;
      this.prix_total = service.prix_total;
      this.date_debut = service.date_debut;
      this. date_fin = service. date_fin;
      this.nb_heures = service.nb_heures;
      this.nb_participants = service.nb_participants;

      // Show the update form
      this.toggleForm2();
    }

    selectType(type: string): void {
      this.type_service = type;
    }


    openserviceFormModal() {
      const modalOptions: NgbModalOptions = {
        size: 'lg' 
      };
    
      const modalRef = this.modalService.open(FormulaireServiceComponent, modalOptions);
      modalRef.componentInstance.clientData = this.selectedservice;
    
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
