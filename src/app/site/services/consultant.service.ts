import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Consultant } from '../classes/consultant';

@Injectable({
  providedIn: 'root'
})
export class ConsultantService {

  constructor(private afs:AngularFirestore){}

  //add consultant

  addconsultant(consultant:Consultant){
    consultant.idcons=this.afs.createId();
    return this.afs.collection('/consultant').add(consultant);
  }

  //get consultant

  getconsultant(){
    return this.afs.collection('/consultant').snapshotChanges();
  }

  //delete consultant

  deleteconsultant(consultant:Consultant){
    return this.afs.doc('/consultant/'+consultant.idcons).delete();
  }

  //update consultant

  updateconsultant(consultant:Consultant){
    this.deleteconsultant(consultant);
    this.addconsultant(consultant);

  }
}
