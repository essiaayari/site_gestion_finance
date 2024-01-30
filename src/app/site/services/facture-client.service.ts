import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FactureClient } from '../classes/facture-client';

@Injectable({
  providedIn: 'root'
})
export class FactureClientService {

  constructor(private afs:AngularFirestore){}

  //add facture_client

  addfacture_client(facture_client:FactureClient){
    facture_client.idfc=this.afs.createId();
    return this.afs.collection('/facture_client').add(facture_client);
  }

  //get facture_client

  getfacture_client(){
    return this.afs.collection('/facture_client').snapshotChanges();
  }

  //delete facture_client

  deletefacture_client(facture_client:FactureClient){
    return this.afs.doc('/facture_client/'+facture_client.idfc).delete();
  }

  //update facture_client

  updatefacture_client(facture_client:FactureClient){
    this.deletefacture_client(facture_client);
    this.addfacture_client(facture_client);

  }
}
