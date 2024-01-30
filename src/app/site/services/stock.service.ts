import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Stock } from '../classes/stock';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor(private afs:AngularFirestore){}

  //add stock

  addstock(stock:Stock){
    stock.idstock=this.afs.createId();
    return this.afs.collection('/stock').add(stock);
  }

  //get stock

  getstock(){
    return this.afs.collection('/stock').snapshotChanges();
  }

  //delete stock

  deletestock(stock:Stock){
    return this.afs.doc('/stock/'+stock.idstock).delete();
  }

  //update stock

  updatestock(stock:Stock){
    this.deletestock(stock);
    this.addstock(stock);

  }}
