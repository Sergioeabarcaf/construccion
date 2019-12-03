import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  module = 'thermal';
  show = null;
  sessionNumber:number = 89;
  data = [];
  lastData: any;
  infoSession = [];
  responsable = 'Responsable';
  material = 'Material';
  status = "Estado"

  constructor(public _firebase: AngularFireDatabase) { }

  getStatus() {
    this._firebase.object(`system/status/${this.module}`).valueChanges().subscribe( (data:any) => {
      console.log(data);
      switch(data.value) {
        case 0:
          // this.show = false;
          this.show = true;
          break;
        case 1:
          this.status = 'Inicio Web';
          this.show = true;
          this.sessionNumber = data.sessionNumber;
          break;
        case 2:
          this.status = 'Midiendo';
          this.show = true;
          this.sessionNumber = data.sessionNumber;
          break;
        case 3:
          this.status = 'Fin Web';
          this.show = true;
          this.sessionNumber = data.sessionNumber;
          break;
        default:
          this.show = true;
          this.status = String(data.value);
          break;
      }
    });
  }

  getActiveSession() {
    this._firebase.object(`init/${this.module}`).valueChanges().subscribe( (data:any) => {
      // if ( data != null ) { 
      //   this.show = true;
      //   this.numberSession = data.sessionNumber;
      //   this.material = data.material;
      //   this.responsable = data.startResponsable;
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
