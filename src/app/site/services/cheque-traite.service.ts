import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ChequeTraite } from '../classes/cheque-traite';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChequeTraiteService {

  constructor(private afs:AngularFirestore){}

  //add cheque_traite

  addcheque_traite(cheque_traite:ChequeTraite){
    cheque_traite.idch_t=this.afs.createId();
    return this.afs.collection('/cheque_traite').add(cheque_traite);
  }

  //get cheque_traite

  getcheque_traite(){
    return this.afs.collection('/cheque_traite').snapshotChanges();
  }

  //delete cheque_traite

  deletecheque_traite(cheque_traite:ChequeTraite){
    return this.afs.doc('/cheque_traite/'+cheque_traite.idch_t).delete();
  }

  //update clients

  updatecheque_traite(cheque_traite: ChequeTraite): Promise<any> {
    return this.afs.doc('/cheque_traite/' + cheque_traite.idch_t).set(cheque_traite, { merge: true });
  }

  gecheque_traite(id: string): Observable<ChequeTraite | undefined> {
    return this.afs.doc('/cheque_traite/' + id).valueChanges() as Observable<ChequeTraite | undefined>;
  }
}
