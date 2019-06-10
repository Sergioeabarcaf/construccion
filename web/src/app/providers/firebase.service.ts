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
    value: 1
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

  // Almacenar toda la data de la sesion actual.
  dataCurrent: any[];

  constructor(public _firebase: AngularFireDatabase, public router: Router) {
  }

  // Almacenar información de la nueva sesion de medición, se usa en NEW
  setInit(formulario: any) {
    console.log(formulario);
    this._firebase.object('init').set(formulario);
    // Si se usan ambos modulos, se actualizan los valores en system/status
    if ( formulario.module === '2' ) {
      console.log(formulario.module);
      this._firebase.object('system/status').update({'thermal': {'value': -1 , 'sesionNumber': 0 },
                                                      'sound': {'value': -1 , 'sesionNumber': 0 },
                                                      'both': {'value': 1 , 'sesionNumber': formulario.sessionNumber }
                                                    });
    }
    // Si se usa solo el modulo thermal, se actualizan los valores en system/status
    if ( formulario.module === '0' ) {
      console.log(formulario.module);
      this._firebase.object('system/status/thermal').update({'value': 1 , 'sesionNumber': formulario.sessionNumber});
    }
    // Si se usa solo el modulo sound, se actualizan los valores en system/status
    if ( formulario.module === '1' ) {
      console.log(formulario.module);
      this._firebase.object('system/status/sound').update({'value': 1 , 'sesionNumber': formulario.sessionNumber});
}
    // Enviar la navegacion a live
    // ----
    // Queda pendiente enviar el parametro con el numero de sesion
    // ----
    this.router.navigate(['live']);
  }

  // Obtener los valores de estado para cada modulo, se usa en INIT
  getStatus() {
    this._firebase.object('system').valueChanges().subscribe( (data: any) => {
      this.thermal = data.status.thermal;
      this.sound = data.status.sound;
      this.both = data.status.both;
      this.currentSessionNumber = data.lastSession + 1;
    });
  }

  // Obtener la información corta de todas las mediciones realizadas, se usa en INIT, SESSIONS
  getInfoSessionsShort() {
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
  getLastDataSessionCurrent(session) {
    this._firebase.list(`data/S-${session}`).valueChanges().subscribe( (data: any[]) => {
      // Almacenar todos los datos recibidos para mostrarlos en live
      this.dataCurrent = data;
      // Extraer el ultimo dato para mostrarlo en gauge
      const dataLast = data.pop();
      this.current.timestamp = dataLast.timestamp;
      this.current.thermal.He = dataLast.thermal.He;
      this.current.thermal.Hi = dataLast.thermal.Hi;
      this.current.thermal.Te = dataLast.thermal.Te;
      this.current.thermal.Ti = dataLast.thermal.Ti;
      this.current.sound.He = dataLast.sound.He;
      this.current.sound.Hi = dataLast.sound.Hi;
      this.current.sound.Te = dataLast.sound.Te;
      this.current.sound.Ti = dataLast.sound.Ti;
      console.log(this.current);
    });
  }

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
