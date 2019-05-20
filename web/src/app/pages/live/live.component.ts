import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../../providers/firebase.service';

@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.css']
})
export class LiveComponent implements OnInit {

  constructor(public _firebase: FirebaseService, public router: Router) {
    // Actualizar los valores de current en firebase.service con los de la ultima sesion.
    this._firebase.getLastDataSessionCurrent(this._firebase.currentSession);
  }

  ngOnInit() {
  }

  stop() {
    // Detener la ejecución del programa en firebase
    this._firebase.stop();
    this.router.navigate(['/init']);
  }

}
