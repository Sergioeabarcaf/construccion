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
  currentSession = -1;
  current = {
    He: 0,
    Te: 0,
    Hi: 0,
    Ti: 0,
    timestamp: ''
  };

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
      this.currentSession = data.lastSession;
    });
  }

  stop() {
    this._firebase.object('system/start').set(false);
    this._firebase.object('init').set(null);
  }

  getSessions() {
    // Obtener el listado se sesiones
    this._firebase.list('sessions').valueChanges().subscribe( (data) => {
      // Ordenar de reciente a antiguos
      this.sessions = data.sort(function (a, b) {
        if (a['info']['timeStart'] > b['info']['timeStart']) {
          return -1;
        }
        if (a['info']['timeStart'] < b['info']['timeStart']) {
          return 1;
        }
        return 0;
      });
    });
  }

  getLastDataSessionCurrent(session) {
    this._firebase.list(`sessions/S-${session}/data`).valueChanges().subscribe( (data: any[]) => {
      const dataLast = data.pop();
      this.current.He = dataLast.He;
      this.current.Hi = dataLast.Hi;
      this.current.Te = dataLast.Te;
      this.current.Ti = dataLast.Ti;
      this.current.timestamp = dataLast.timestamp;
      console.log(this.current);
    });

  }

  getSession(index) {
    return this.sessions[index];
  }
}
