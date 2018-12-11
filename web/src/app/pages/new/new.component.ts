import { Component, OnInit } from '@angular/core';
import { Auth0Service } from '../../providers/auth0.service';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent implements OnInit {
  public profile: any;

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
