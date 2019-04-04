import { Component, OnInit, Input } from '@angular/core';
import { Auth0Service } from '../../providers/auth0.service';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { FirebaseService } from '../../providers/firebase.service';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent implements OnInit {
  public profile: any;
  formulario: FormGroup;
  dateTime = new Date();
  now: string = '';

  constructor(public _auth0: Auth0Service, public _firebase: FirebaseService) {

    this.now = this.dateTime.getFullYear().toString() + '-' + this.appendZero(this.dateTime.getMonth() + 1) + '-' + this.appendZero(this.dateTime.getDate()) + 'T' + this.appendZero(this.dateTime.getHours()) + ':' + this.appendZero(this.dateTime.getMinutes());

    if (this._auth0.userProfile) {
      this.profile = this._auth0.userProfile;
    } else {
      this._auth0.getProfile((err, profile) => {
        this.profile = profile;
      });
    }
  }

  ngOnInit() {
    this.formulario = new FormGroup({
      'responsable': new FormControl(this.profile.name, Validators.required),
      'material': new FormControl('', Validators.required),
      'intervalTime': new FormControl('00:00:30', Validators.required),
      'finishedType': new FormControl('manual', Validators.required),
      'endTime': new FormControl( this.now )
    });
  }

  guardarCambios() {
    this._firebase.setInit(this.formulario.value);
  }

  appendZero( num: number ) {
    if ( num < 10 ){
      return '0' + num.toString();
    } else {
      return num.toString();
    }
  }
}
