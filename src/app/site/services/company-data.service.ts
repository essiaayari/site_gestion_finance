import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class CompanyDataService {

  constructor(private afs:AngularFirestore){}
  
  //get clients

  getcampanydata(){
    return this.afs.collection('/data_company').snapshotChanges();
  }

}
