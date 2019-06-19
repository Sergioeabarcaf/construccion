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
    sessionNumber: -1,
    value: -1
  };
  sound = {
    sessionNumber: -1,
    value: -1
  };
  both = {
    sessionNumber: -1,
    value: -1
  };
  // Almacenar el numero de la sesion a realizar.
  currentSessionNumber = -1;

  // Ultimos valores recibidos de la ultima sesion.
  soundData = {
    timestamp: 0,
    He: 0,
    Te: 0,
    Hi: 0,
    Ti: 0
  };

  thermalData = {
    timestamp: 0,
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
  dataCurrentThermal: any;
  dataCurrentSound: any;

  // Almacenar la informacion completa y abreviada de la sesion actual.
  infoLargeCurrent: any;
  infoShortCurrent: any;

  // Flag para infoLargeSession, infoShortSession y dataCurrent se usa en SESSION
  infoLargeSessionCurrentReady = false;
  infoShortSessionCurrentReady = false;
  dataSessionCurrentReady = false;

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
    // Actualizar el numero de la ultima sesion utilizada
    this._firebase.object('system/lastSession').set(formulario.sessionNumber);
    console.log(formulario);
    if ( formulario.module === 2 ) {
      // Se agregan los parametros de iniciacion en init para ambos modulos.
      this._firebase.object('init/thermal').set(formulario);
      this._firebase.object('init/sound').set(formulario);
      // Se actualizan los estados en system/Status
      this._firebase.object('system/status').update({'thermal': {'value': 1 , 'sessionNumber': formulario.sessionNumber },
                                                      'sound': {'value': 1 , 'sessionNumber': formulario.sessionNumber },
                                                      'both': {'value': 1 , 'sessionNumber': formulario.sessionNumber }
                                                    });
    }
    // Si se usa solo el modulo thermal, se actualizan los valores en system/status
    if ( formulario.module === 0 ) {
      // Se agregan los parametros de iniciacion en init para modulo thermal.
      this._firebase.object('init/thermal').set(formulario);
      this._firebase.object('system/status').update({'thermal': {'value': 1 , 'sessionNumber': formulario.sessionNumber},
                                                      'both': {'value': -1 , 'sessionNumber': 0 }});
    }
    // Si se usa solo el modulo sound, se actualizan los valores en system/status
    if ( formulario.module === 1 ) {
      // Se agregan los parametros de iniciacion en init para modulo sound.
      this._firebase.object('init/sound').set(formulario);
      this._firebase.object('system/status').update({'sound': {'value': 1 , 'sessionNumber': formulario.sessionNumber},
                                                      'both': {'value': -1 , 'sessionNumber': 0 }});
    }
    // Enviar la navegacion a live con el numero de sesion
    this.router.navigate(['/live', formulario.sessionNumber]);
  }

  // Obtener la información corta de todas las mediciones realizadas, se usa en INIT, SESSIONS
  getInfoSessionsShort() {
    // Limpiar infoSessionShort
    this.infoSessionsShort = null;
    // Obtener el listado se sesiones
    this._firebase.list('info/short', ref => ref.orderByChild('startTimestamp')).valueChanges().subscribe( (data: any[]) => {
      // invertir orden del array
      this.infoSessionsShort = data.reverse();
      console.log(this.infoSessionsShort);
    });
  }

  // Obtener informacion corta, se usa en LIVE
  getInfoShortCurrent(session) {
    // Limpiar infoShortCurrent
    this.infoShortCurrent = null;
    // Cada vez que se solicite una informacion, comience en false y cambie cuando los datos ya estan cargados.
    this.infoShortSessionCurrentReady = false;
    this._firebase.object(`info/short/S-${session}`).valueChanges().subscribe( (data: any) => {
      this.infoShortCurrent = data;
      this.infoShortSessionCurrentReady = true;
      console.log(this.infoShortCurrent);
    });
  }

  // Obtener la informacion completa de la sesion, se usa en SESSION
  getInfoLargeCurrent(session) {
    // Limpiar infoLargeCurrent
    this.infoLargeCurrent = null;
    // Cada vez que se solicite una informacion, comience en false y cambie cuando los datos ya estan cargados.
    this.infoLargeSessionCurrentReady = false;
    this._firebase.object(`info/large/S-${session}`).valueChanges().subscribe( (data: any) => {
      this.infoLargeCurrent = data;
      this.infoLargeSessionCurrentReady = true;
      console.log(this.infoLargeCurrent);
    });
  }

  // Se actualizan los datos de current con la ultima sesion realizada, se usa en LIVE
  getDataSessionCurrent(session) {
    // limpiar variables dataCurrent
    this.dataCurrentThermal = null;
    this.dataCurrentSound = null;
    // Colocar flag en false cada vez que se obtienen datos.
    this.dataSessionCurrentReady = false;
    this._firebase.list(`data/S-${session}/thermal`).valueChanges().subscribe( (data: any[]) => {
      // Almacenar todos los datos recibidos para mostrarlos en tablas
      this.dataCurrentThermal = data;
      // Extraer el ultimo dato para mostrarlo en gauge
      const dataLastThermal = data[data.length - 1];
      this.current.thermal.timestamp = dataLastThermal.timestamp;
      this.current.thermal.He = dataLastThermal.He;
      this.current.thermal.Hi = dataLastThermal.Hi;
      this.current.thermal.Te = dataLastThermal.Te;
      this.current.thermal.Ti = dataLastThermal.Ti;
      console.log(this.current);
    });

    this._firebase.list(`data/S-${session}/sound`).valueChanges().subscribe( (data: any[]) => {
      // Almacenar todos los datos recibidos para mostrarlos en tablas
      this.dataCurrentSound = data;
      // Extraer el ultimo dato para mostrarlo en gauge
      const dataLastSound = data[data.length - 1];
      this.current.sound.timestamp = dataLastSound.timestamp;
      this.current.sound.He = dataLastSound.He;
      this.current.sound.Hi = dataLastSound.Hi;
      this.current.sound.Te = dataLastSound.Te;
      this.current.sound.Ti = dataLastSound.Ti;
      console.log(this.current);
    });
    this.dataSessionCurrentReady = true;
  }

  // Setear las variables para detener la ejecución del programa en python, se usa en LIVE
  stop(endResponsable, sessionNumber) {
    console.log(this.infoShortCurrent.module);
    // Almacenar al responsable de la detencion.
    this._firebase.object(`info/large/S-${sessionNumber}/endResponsable`).set(endResponsable);
    // Si se usan ambos modulos, se actualizan los valores en system/status
    if ( this.infoShortCurrent.module === 2 ) {
      this._firebase.object('system/status/both').update({'value': 3 , 'sessionNumber': sessionNumber });
    }
    // Si se usa solo el modulo thermal, se actualizan los valores en system/status
    if ( this.infoShortCurrent.module === 0 ) {
      this._firebase.object('system/status/thermal').update({'value': 3 , 'sessionNumber': sessionNumber });
    }
    // Si se usa solo el modulo sound, se actualizan los valores en system/status
    if ( this.infoShortCurrent.module === 1 ) {
      this._firebase.object('system/status/sound').update({'value': 3 , 'sessionNumber': sessionNumber });
    }
  }

}
