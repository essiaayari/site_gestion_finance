import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FactureFournisseur } from '../classes/facture-fournisseur';

@Injectable({
  providedIn: 'root'
})
export class FactureFournisseurService {

  constructor(private afs:AngularFirestore){}

  //add FactureFournisseur
  addFactureFournisseur(facture_fournisseur:FactureFournisseur){
    facture_fournisseur.idff=this.afs.createId();
    return this.afs.collection('/facture_fournisseur').add(facture_fournisseur);
  }

  //get FactureFournisseur

  getFactureFournisseur(){
    return this.afs.collection('/facture_fournisseur').snapshotChanges();
  }

  //delete FactureFournisseur

  deleteFactureFournisseur(facture_fournisseur:FactureFournisseur){
    return this.afs.doc('/facture_fournisseur/'+facture_fournisseur.idff).delete();
  }

  //update FactureFournisseur

  updatefacture_fournisseur(facture_fournisseur:FactureFournisseur){
    this.deleteFactureFournisseur(facture_fournisseur);
    this.addFactureFournisseur(facture_fournisseur);

}
}