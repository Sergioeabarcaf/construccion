import { Component } from '@angular/core';
import { Auth0Service } from './providers/auth0.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'web';

  constructor(public _auth0: Auth0Service) {}
}
