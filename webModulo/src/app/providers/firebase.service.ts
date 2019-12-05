import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  module = 'thermal';
  show = null;
  sessionNumber:number;
  data = [];
  lastData: any;
  infoSession = [];
  responsable:String;
  material:String;
  status:String;

  constructor(public _firebase: AngularFireDatabase) { }

  getStatus() {
    this._firebase.object(`system/status/${this.module}`).valueChanges().subscribe( (data:any) => {
      if(data != -1) {
        this.sessionNumber = data.sessionNumber;
        switch(data.value) {
          case 0:
            this.show = false;
            break;
          case 1:
            this.status = 'Inicio Web';
            this.show = true;
            break;
          case 2:
            this.status = 'Midiendo';
            this.show = true;
            break;
          case 3:
            this.status = 'Fin Web';
            this.show = true;
            break;
          default:
            this.status = `error: ${data.value}`;
            this.show = true;
            break;
        }
        this.getInfoSession(data.sessionNumber);
      } else {
        this.show = false;
      }
    });
  }

  getInfoSession(sessionNumber) {
    this._firebase.object(`info/short/S-${sessionNumber}`).valueChanges().subscribe( (data:any) => {
      console.log(data);
      this.material = data.material;
      this.responsable = data.startResponsable;
    });    
  }

  getDataSessionActive() {
    if ( this.data.length > 0) {
      console.log('hay datos.');
      console.log(this.data);
    } else {
      console.log('No hay datos');
      this._firebase.list(`data/S-${this.sessionNumber}/${this.module}`).valueChanges().subscribe( (data:any[]) => {
        console.log(data);
        this.data = data.reverse();
        this.lastData = this.data[0];
      });
    }
  }

  getDataSessionActivePromise() {
    return new Promise( (resolve, reject) =>{
      console.log(`data/S-${this.sessionNumber}/${this.module}`);
      this._firebase.list(`data/S-${this.sessionNumber}/${this.module}`).valueChanges().subscribe( (info:any[]) => {
        console.log(this.data);
        resolve(info);
      });
    });
  } 
}
