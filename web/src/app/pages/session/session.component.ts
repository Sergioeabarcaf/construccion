import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../providers/firebase.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css']
})
export class SessionComponent implements OnInit {

  proyecto = null;

  constructor(public _firebase: FirebaseService, public activatedRoute: ActivatedRoute, public router: Router) {
    this.activatedRoute.params.subscribe( param => {
      this.proyecto = this._firebase.getSession(param.id);
      console.log(this.proyecto);
    });
  }

  ngOnInit() {
  }

}
