import { Component, OnInit } from '@angular/core';
import { Auth0Service } from '../../providers/auth0.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent implements OnInit {
  public profile: any;
  formulario: FormGroup;

  constructor(public _auth0: Auth0Service) {

    if (this._auth0.userProfile) {
      this.profile = this._auth0.userProfile;
    } else {
      this._auth0.getProfile((err, profile) => {
        this.profile = profile;
      });
    }

    this.formulario = new FormGroup({
      'responsable': new FormControl(this.profile.name, Validators.required),
      'material': new FormControl('', Validators.required),
      'intervalTime': new FormControl('00:01:00', Validators.required),
      'tipoFinalizado': new FormControl('manual', Validators.required),
      'horaFinalizado': new FormControl(),
      'fechaFinalizado': new FormControl()
    });
  }

  ngOnInit() { }

  guardarCambios() {
    console.log(this.formulario.value);
  }
}
