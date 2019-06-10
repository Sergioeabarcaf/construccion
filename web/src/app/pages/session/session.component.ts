import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../providers/firebase.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css']
})
export class SessionComponent implements OnInit {

  constructor(public _firebase: FirebaseService, public activatedRoute: ActivatedRoute, public router: Router) {
    this.activatedRoute.params.subscribe( param => {
      // Actualizar los valores de current en firebase.service con los de la ultima sesion.
      this._firebase.getInfoLargeCurrent(param.id);
      this._firebase.getDataSessionCurrent(param.id);
    });
  }

  ngOnInit() {
  }

}
