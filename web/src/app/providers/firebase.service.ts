import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  start: any;

  constructor(public _firebase: AngularFireDatabase, public router: Router) {
  }

  setInit(formulario: any) {
    console.log(formulario);
    this._firebase.object('init').set(formulario);
    this._firebase.object('system/start').set(true);
    this.router.navigate(['live']);
  }

  getInit() {
    this._firebase.object('system/start').valueChanges().subscribe( data => {
      this.start = data;
    });
  }

  stop() {
    this._firebase.object('system/start').set(false);
    this._firebase.object('init').set(null);
  }
}
