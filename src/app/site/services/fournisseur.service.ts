import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Fournisseur } from '../classes/fournisseur';

@Injectable({
  providedIn: 'root'
})
export class FournisseurService {
  constructor(private afs:AngularFirestore){}

  //add fournisseur

  addfournisseur(fournisseur:Fournisseur){
    fournisseur.idf=this.afs.createId();
    return this.afs.collection('/fournisseur').add(fournisseur);
  }

  //get fournisseur

  getfournisseur(){
    return this.afs.collection('/fournisseur').snapshotChanges();
  }

  //delete fournisseur

  deletefournisseur(fournisseur:Fournisseur){
    return this.afs.doc('/fournisseur/'+fournisseur.idf).delete();
  }

  //update fournisseur

  updatefournisseur(fournisseur:Fournisseur){
    this.deletefournisseur(fournisseur);
    this.addfournisseur(fournisseur);

  }
}
