import { Component, OnInit } from '@angular/core';
import { Auth0Service } from '../../providers/auth0.service';
import { FirebaseService } from '../../providers/firebase.service';


@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.css']
})
export class InitComponent implements OnInit {

  // Flag para identificar si los datos del usuario ya estan listos.
  ready = false;

  constructor(public _auth0: Auth0Service, public _firebase: FirebaseService) {
    // Obtener los datos del usuario autentificado
    this._auth0.getProfile((err, profile) => {
      this.ready = true;
    });
    // Obtener los estados de cada modulos desde firebase.
    this._firebase.getStatus();
    // Obtener la informacion corta de todas las sesiones almacenadas en Firebase.
    this._firebase.getinfoSessionsShort();
  }

  ngOnInit() {}

}
