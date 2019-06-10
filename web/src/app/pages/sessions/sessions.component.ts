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
    // Obtener la informacion corta de todas las sesiones almacenadas en Firebase.
    this._firebase.getinfoSessionsShort();
  }

  ngOnInit() {
  }

  goToSession(index) {
    this.router.navigate(['/session', index]);
  }

}
