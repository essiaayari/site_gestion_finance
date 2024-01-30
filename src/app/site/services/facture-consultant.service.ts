import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FactureConsultant } from '../classes/facture-consultant';

@Injectable({
  providedIn: 'root'
})
export class FactureConsultantService {

  constructor(private afs:AngularFirestore){}

  //add facture_consultant

  addfacture_consultant(facture_consultant:FactureConsultant){
    facture_consultant.idfcons=this.afs.createId();
    return this.afs.collection('/FactureConsultant').add(facture_consultant);
  }

  //get facture_consultant

  getfacture_consultant(){
    return this.afs.collection('/FactureConsultant').snapshotChanges();
  }

  //delete facture_consultant

  deletefacture_consultant(facture_consultant:FactureConsultant){
    return this.afs.doc('/FactureConsultant/'+facture_consultant.idfcons).delete();
  }

  //update facture_consultant

  updatefacture_consultant(facture_consultant:FactureConsultant){
    this.deletefacture_consultant(facture_consultant);
    this.addfacture_consultant(facture_consultant);


  }}
