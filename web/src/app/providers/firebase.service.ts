import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  start = null;
  python = null;
  sessions = null;

  constructor(public _firebase: AngularFireDatabase, public router: Router) {
  }

  setInit(formulario: any) {
    console.log(formulario);
    this._firebase.object('init').set(formulario);
    this._firebase.object('system/start').set(true);
    this.router.navigate(['live']);
  }

  getInit() {
    this._firebase.object('system').valueChanges().subscribe( (data: any) => {
      this.start = data.start;
      this.python = data.python;
    });
  }

  stop() {
    this._firebase.object('system/start').set(false);
    this._firebase.object('init').set(null);
  }

  getSessions() {
    this._firebase.list('sessions').valueChanges().subscribe( (data) => {
      this.sessions = data;
    });
  }

  getSession(index) {
    return this.sessions[index];
  }
}
