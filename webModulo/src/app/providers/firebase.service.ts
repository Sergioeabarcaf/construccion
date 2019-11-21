import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(public _firebase: AngularFireDatabase) { }

  getInfoSessionsShort() {
    this._firebase.list('info/short', ref => ref.orderByChild('startTimestamp')).valueChanges().subscribe( (data: any[]) => {
      console.log(data);
    });
  }
}
