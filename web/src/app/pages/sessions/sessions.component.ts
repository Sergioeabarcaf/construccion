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
<<<<<<< HEAD
    // Obtener la informacion corta de todas las sesiones almacenadas en Firebase.
    this._firebase.getinfoSessionsShort();
=======
    // Obtener las sesiones en Firebase.service
    this._firebase.getInfoSessionsShort();
>>>>>>> ba2eed828f87daf1de558d2b225ee671dc8b0a4f
  }

  ngOnInit() {
  }

  goToSession(index) {
    this.router.navigate(['/session', index]);
  }

}
