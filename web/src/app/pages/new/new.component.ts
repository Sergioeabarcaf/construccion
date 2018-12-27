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
  date = new Date();
  today = '';

  constructor(public _auth0: Auth0Service, public _firebase: FirebaseService) {

    this.getToday();

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
      'tipoFinalizado': new FormControl('manual', Validators.required),
      'horaFinalizado': new FormControl(),
      'fechaFinalizado': new FormControl(this.today)
    });
  }

  guardarCambios() {
    this._firebase.setInit(this.formulario.value);
  }

  getToday() {
    this.today = this.date.getFullYear() + '-' + (this.date.getMonth() + 1) + '-' + this.date.getDate();
    this.date.setHours(0, 0, 0, 0);
  }

  validDateMin() {
    const dateInput = new Date(this.formulario.controls.fechaFinalizado.value);
    dateInput.setHours(0, 0, 0, 0);
    dateInput.setDate(dateInput.getDate() + 1);
    if ( this.date <= dateInput ) {
      return true;
    } else {
      return false;
    }
  }
}
