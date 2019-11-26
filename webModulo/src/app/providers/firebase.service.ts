import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  module = 'thermal';
  show = true;
  numberSession:number = 89;
  data = [];
  lastData: any;
  infoSession = [];

  constructor(public _firebase: AngularFireDatabase) { }

  getActiveSession() {
    this._firebase.object(`init/${this.module}`).valueChanges().subscribe( (data:any) => {
      // if ( data != null ) { 
      //   this.show = true;
      //   this.numberSession = data.sessionNumber;
      // } else {
      //   this.show = false;
      // }
      this.show = true;
    });
  }

  getDataSessionActive() {
    this._firebase.list(`data/S-${this.numberSession}/${this.module}`).valueChanges().subscribe ( (info:any[]) => {
      this.data = info.reverse();
      this.lastData = this.data[0];
    });
  }

  getDataSessionActivePromise = new Promise( (resolve, reject) =>{
    this._firebase.list(`data/S-${this.numberSession}/${this.module}`).valueChanges().subscribe ( (info:any[]) => {
      resolve(this.data);
    });
  });
}
