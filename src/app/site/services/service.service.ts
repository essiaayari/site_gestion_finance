import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Service } from '../classes/service';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private afs:AngularFirestore){}

  //add service

  addservice(service:Service){
    service.ids=this.afs.createId();
    return this.afs.collection('/service').add(service);
  }

  //get clients

  getservice(){
    return this.afs.collection('/service').snapshotChanges();
  }

  //delete service

  deleteservice(service:Service){
    return this.afs.doc('/service/'+service.ids).delete();
  }

  //update service

  updateservice(service:Service){
    this.deleteservice(service);
    this.addservice(service);

  }}
