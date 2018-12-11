import { Component, OnInit } from '@angular/core';
import { Auth0Service } from '../../providers/auth0.service';

@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.css']
})
export class InitComponent implements OnInit {

  profile: any;

  constructor(public _auth0: Auth0Service) { }

  ngOnInit() {
    if (this._auth0.userProfile) {
      this.profile = this._auth0.userProfile;
    } else {
      this._auth0.getProfile((err, profile) => {
        this.profile = profile;
      });
    }
    console.log(this.profile);
  }

}
