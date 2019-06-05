import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class FirebaseService {
  // Variables para ver si se inicia una nueva sesion o se revisa la actual
  thermal = {
    sesionNumber: -1,
    value: 0
  };
  sound = {
    sesionNumber: -1,
    value: 0
  };
  both = {
    sesionNumber: -1,
    value: -1
  };
  // Almacenar el numero de la ultima sesion realizada.
  currentSessionNumber = -1;
  // Almacena la informacion corta de todas las sesiones almacenadas.
  infoSessionsShort = null;
  // Ultimos valores recibidos de la ultima sesion.
  soundData = {
    He: 0,
    Te: 0,
    Hi: 0,
    Ti: 0
  };

  thermalData = {
    He: 0,
    Te: 0,
    Hi: 0,
    Ti: 0
  };

  current = {
    timestamp: '',
    thermal: this.thermalData,
    sound: this.soundData
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

  // Obtener los valores de estado para cada modulo, se usa en INIT
  getStatus() {
    this._firebase.object('system').valueChanges().subscribe( (data: any) => {
      this.thermal = data.status.thermal;
      this.sound = data.status.sound;
      this.both = data.status.both;
      this.currentSessionNumber = data.lastSession;
    });
  }

  // Obtener la información corta de todas las mediciones realizadas, se usa en INIT, SESSIONS
  getinfoSessionsShort() {
    // Obtener el listado se sesiones
    this._firebase.list('info/short').valueChanges().subscribe( (data) => {
      // Ordenar de reciente a antiguos
      this.infoSessionsShort = data.sort(function (a, b) {
        if (a['timeStart'] > b['timeStart']) {
          return -1;
        }
        if (a['timeStart'] < b['timeStart']) {
          return 1;
        }
        return 0;
      });
    });
  }

  // Se actualizan los datos de current con la ultima sesion realizada, se usa en LIVE
  // getLastDataSessionCurrent(session) {
  //   this._firebase.list(`sessions/S-${session}/data`).valueChanges().subscribe( (data: any[]) => {
  //     const dataLast = data.pop();
  //     this.current.He = dataLast.He;
  //     this.current.Hi = dataLast.Hi;
  //     this.current.Te = dataLast.Te;
  //     this.current.Ti = dataLast.Ti;
  //     this.current.timestamp = dataLast.timestamp;
  //     console.log(this.current);
  //   });
  // }

  // Setear las variables para detener la ejecución del programa en python, se usa en LIVE
  stop() {
    this._firebase.object('system/start').set(false);
    this._firebase.object('init').set(null);
  }

  // Se retornan los valores de la sesion en base al id solicitado, se una sen SESSION
  // getSession(index) {
  //   return this.sessions[index];
  // }
}
