import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
import { Auth0Service } from './auth0.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(public _auth0: Auth0Service) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log(next);
    console.log(state);
    if (this._auth0.isAuthenticated()) {
      return true;
    } else {
      console.error('No tienes los permisos para acceder.');
      return false;
    }
  }
}
