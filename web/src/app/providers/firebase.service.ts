import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class FirebaseService {
  // Variables para ver si se inicia una nueva sesion o se revisa la actual
  start = null;
  python = null;
  // Almacena toda las sesiones 
  sessions = null;
  // Almacenar el numero de la ultima sesion realizada.
  currentSession = -1;
  // Ultimos valores recibidos de la ultima sesion.
  current = {
    He: 0,
    Te: 0,
    Hi: 0,
    Ti: 0,
    timestamp: ''
  };

  constructor(public _firebase: AngularFireDatabase, public router: Router) {
  }

  // Almacenar información de la nueva sesion de medición, se usa en NEW
  setInit(formulario: any) {
    console.log(formulario);
    this._firebase.object('init').set(formulario);
    this._firebase.object('system/start').set(true);
    this.router.navigate(['live']);
  }

  // Obtener las variables de start y python y validar desde Firebase, se usa en INIT
  getInit() {
    this._firebase.object('system').valueChanges().subscribe( (data: any) => {
      this.start = data.start;
      this.python = data.python;
      this.currentSession = data.lastSession;
    });
  }

  // Se obtienen todas las sesiones almacenadas en Firebase, se usa en INIT, SESSIONS
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

  // Se actualizan los datos de current con la ultima sesion realizada, se usa en LIVE
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

  // Setear las variables para detener la ejecución del programa en python, se usa en LIVE
  stop() {
    this._firebase.object('system/start').set(false);
    this._firebase.object('init').set(null);
  }

  // Se retornan los valores de la sesion en base al id solicitado, se una sen SESSION
  getSession(index) {
    return this.sessions[index];
  }
}
