import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Devis } from '../classes/devis';

@Injectable({
  providedIn: 'root'
})
export class DevisService {

  constructor(private afs:AngularFirestore){}

  //add devis

  adddevis(devis:Devis){
    devis.iddev=this.afs.createId();
    return this.afs.collection('/devis').add(devis);
  }

  //get devis

  getdevis(){
    return this.afs.collection('/devis').snapshotChanges();
  }

  //delete devis

  deletedevis(devis:Devis){
    return this.afs.doc('/devis/'+devis.iddev).delete();
  }

  //update devis

  updatedevis(devis:Devis){
    this.deletedevis(devis);
    this.adddevis(devis);

  }}
