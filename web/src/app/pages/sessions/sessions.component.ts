import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../providers/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.css']
})
export class SessionsComponent implements OnInit {

  constructor(public _firebase: FirebaseService, public router: Router) {
    // Obtener las sesiones en Firebase.service
    this._firebase.getInfoSessionsShort();
  }

  ngOnInit() {
  }

  goToSession(dir, session) {
    // Navegar a session si esta ya ha terminado.
    if (dir === 0) {
      this.router.navigate(['/session', session]);
    }
    // Navegar a live si aun no termina la medicion.
    if (dir === 1) {
      this.router.navigate(['/live', session]);
    }
  }
}
