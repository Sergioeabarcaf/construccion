import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  module = 'thermal';
  show = true;
  data: any;
  lastData: any;

  constructor(public _firebase: AngularFireDatabase) { }

  getActiveSession() {
    this._firebase.object(`init/${this.module}`).valueChanges().subscribe( (data:any) => {
      console.log(data);
      this.show = true;
    });
  }

  getDataSessionActive(numberSession) {
    this._firebase.list(`data/S-${numberSession}/${this.module}`).valueChanges().subscribe ( (data:any) => {
      this.data = data.reverse();
      this.lastData = this.data[0];
      console.log(this.lastData);
    });
  }
}
