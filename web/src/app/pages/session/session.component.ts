import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../providers/firebase.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css']
})
export class SessionComponent implements OnInit {

  session = null;
  dataSession = [];

  constructor(public _firebase: FirebaseService, public activatedRoute: ActivatedRoute, public router: Router) {
    this.activatedRoute.params.subscribe( param => {
      // Obtener la sesion correspondiente al id solicitado.
      this.session = this._firebase.getSession(param.id);
      // Traspasar los datos a un array.
      this.getData();
      console.log(this.session);
    });
  }

  ngOnInit() {
  }

  // Recorrer la seccion del objeto session y agregar cada valor de Data en un array dataSession, para mostrar
  // los datos en una tabla con un ngFor.
  getData() {
    Object.values(this.session.data).forEach( value => {
      this.dataSession.push(value);
    });
  }

}
