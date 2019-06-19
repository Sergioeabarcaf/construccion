import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from '../../providers/firebase.service';
import { Auth0Service } from '../../providers/auth0.service';


@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.css']
})
export class LiveComponent implements OnInit {

  profile: any;
  sessionNumberCurrent: -1;

  constructor(public _auth0: Auth0Service, public _firebase: FirebaseService, public activatedRoute: ActivatedRoute, public router: Router) {
    // Obtener perfil del usuario
    if (this._auth0.userProfile) {
      this.profile = this._auth0.userProfile;
    } else {
      this._auth0.getProfile((err, profile) => {
        this.profile = profile;
      });
    }

    this.activatedRoute.params.subscribe( param => {
      this.sessionNumberCurrent = param.id;
      // Actualizar los valores de current en firebase.service con los de la ultima sesion.
      this._firebase.getDataSessionCurrent(param.id);
      // Obtener informacion corta de la sesion
      this._firebase.getInfoShortCurrent(param.id);
    });
  }

  ngOnInit() {
  }

  stop() {
    // Detener la ejecución del programa en firebase
    this._firebase.stop(this.profile.name, this.sessionNumberCurrent);
    this.router.navigate(['/init']);
  }

}
