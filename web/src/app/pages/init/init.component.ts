import { Component, OnInit } from '@angular/core';
import { Auth0Service } from '../../providers/auth0.service';


@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.css']
})
export class InitComponent implements OnInit {

  ready = false;

  constructor(public _auth0: Auth0Service) {
    this._auth0.getProfile((err, profile) => {
      this.ready = true;
    });
  }

  ngOnInit() {}

}
