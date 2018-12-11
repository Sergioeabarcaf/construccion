import { Component, OnInit } from '@angular/core';
import { Auth0Service } from '../../../providers/auth0.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(public _auth0: Auth0Service) {
    _auth0.handleAuthentication();
  }

  ngOnInit() {
  }



}
