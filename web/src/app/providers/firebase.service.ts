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
    value: -1
  };
  sound = {
    sesionNumber: -1,
    value: -1
  };
  both = {
    sesionNumber: -1,
    value: -1
  };
  // Almacenar el numero de la sesion a realizar.
  currentSessionNumber = -1;

  // Ultimos valores recibidos de la ultima sesion.
  soundData = {
    timestamp: '',
    He: 0,
    Te: 0,
    Hi: 0,
    Ti: 0
  };

  thermalData = {
    timestamp: '',
    He: 0,
    Te: 0,
    Hi: 0,
    Ti: 0
  };

  current = {
    thermal: this.thermalData,
    sound: this.soundData
  };

  // Almacena la informacion corta de todas las sesiones almacenadas.
  infoSessionsShort = null;

  // Almacenar toda la data de la sesion actual.
  dataCurrent: any;

  // Almacenar la informacion completa de la sesion actual.
  infoLargeCurrent: any;

  constructor(public _firebase: AngularFireDatabase, public router: Router) {
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

  // Almacenar información de la nueva sesion de medición, se usa en NEW
  setInit(formulario: any) {
    console.log(formulario);
    if ( formulario.module === 2 ) {
      console.log(formulario.module);
      // Se agregan los parametros de iniciacion en init para ambos modulos.
      this._firebase.object('init/thermal').set(formulario);
      this._firebase.object('init/sound').set(formulario);
      // Se actualizan los estados en system/Status
      this._firebase.object('system/status').update({'thermal': {'value': -1 , 'sesionNumber': 0 },
                                                      'sound': {'value': -1 , 'sesionNumber': 0 },
                                                      'both': {'value': 1 , 'sesionNumber': formulario.sessionNumber }
                                                    });
    }
    // Si se usa solo el modulo thermal, se actualizan los valores en system/status
    if ( formulario.module === 0 ) {
      console.log(formulario.module);
      // Se agregan los parametros de iniciacion en init para modulo thermal.
      this._firebase.object('init/thermal').set(formulario);
      this._firebase.object('system/status').update({'thermal': {'value': 1 , 'sesionNumber': formulario.sessionNumber},
                                                      'both': {'value': -1 , 'sesionNumber': 0 }});
    }
    // Si se usa solo el modulo sound, se actualizan los valores en system/status
    if ( formulario.module === 1 ) {
      console.log(formulario.module);
      // Se agregan los parametros de iniciacion en init para modulo sound.
      this._firebase.object('init/sound').set(formulario);
      this._firebase.object('system/status').update({'sound': {'value': 1 , 'sesionNumber': formulario.sessionNumber},
                                                      'both': {'value': -1 , 'sesionNumber': 0 }});
    }
    // Enviar la navegacion a live con el numero de sesion
    this.router.navigate(['/live', formulario.sessionNumber]);
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

  // Obtener la informacion completa de la sesion, se usa en LIVE
  getInfoLargeCurrent(session) {
    this._firebase.object(`info/large/S-${session}`).valueChanges().subscribe( (data: any) => {
      this.infoLargeCurrent = data;
    });
  }

  // Se actualizan los datos de current con la ultima sesion realizada, se usa en LIVE
  getDataSessionCurrent(session) {
    this._firebase.list(`data/S-${session}`).valueChanges().subscribe( (data: any) => {
      // Almacenar todos los datos recibidos para mostrarlos en tablas
      this.dataCurrent = data;
      // Extraer el ultimo dato para mostrarlo en gauge
      const dataLastThermal = data.thermal.pop();
      this.current.thermal.timestamp = dataLastThermal.timestamp;
      this.current.thermal.He = dataLastThermal.thermal.He;
      this.current.thermal.Hi = dataLastThermal.thermal.Hi;
      this.current.thermal.Te = dataLastThermal.thermal.Te;
      this.current.thermal.Ti = dataLastThermal.thermal.Ti;
      const dataLastSound = data.sound.pop();
      this.current.sound.timestamp = dataLastSound.timestamp;
      this.current.sound.He = dataLastSound.sound.He;
      this.current.sound.Hi = dataLastSound.sound.Hi;
      this.current.sound.Te = dataLastSound.sound.Te;
      this.current.sound.Ti = dataLastSound.sound.Ti;
      console.log(this.current);
    });
  }

  // Setear las variables para detener la ejecución del programa en python, se usa en LIVE
  stop(endResponsable, sessionNumber) {
    console.log(this.infoLargeCurrent.module);
    // Almacenar al responsable de la detencion.
    this._firebase.object(`info/large/S-${sessionNumber}/endResponsable`).set(endResponsable);
    // Limpiar la zona de init.
    this._firebase.object('init').set(null);
    // Si se usan ambos modulos, se actualizan los valores en system/status
    if ( this.infoLargeCurrent.module === '2' ) {
      this._firebase.object('system/status/both').update({'value': 3 , 'sesionNumber': sessionNumber });
    }
    // Si se usa solo el modulo thermal, se actualizan los valores en system/status
    if ( this.infoLargeCurrent.module === '0' ) {
      this._firebase.object('system/status/thermal').update({'value': 3 , 'sesionNumber': sessionNumber });
    }
    // Si se usa solo el modulo sound, se actualizan los valores en system/status
    if ( this.infoLargeCurrent.module === '1' ) {
      this._firebase.object('system/status/sound').update({'value': 3 , 'sesionNumber': sessionNumber });
    }
  }

}
