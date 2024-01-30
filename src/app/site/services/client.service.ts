import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Client } from '../classes/client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private afs:AngularFirestore){}

  //add clients

  addclient(client:Client){
    client.idc=this.afs.createId();
    return this.afs.collection('/client').add(client);
  }

  //get clients

  getclients(){
    return this.afs.collection('/client').snapshotChanges();
  }

  //delete clients

  deleteclients(client:Client){
    return this.afs.doc('/client/'+client.idc).delete();
  }

  //update clients

  updateclients(client: Client): Promise<any> {
    return this.afs.doc('/client/' + client.idc).set(client, { merge: true });
  }
  getClientById(id: string): Observable<Client | undefined> {
    return this.afs.doc('/client/' + id).valueChanges() as Observable<Client | undefined>;
  }

}
