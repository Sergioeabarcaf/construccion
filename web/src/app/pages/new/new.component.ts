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

  constructor(public _auth0: Auth0Service, public _firebase: FirebaseService) {

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
      'finishedDays': new FormControl(0, Validators.min(0)),
      'finishedHours': new FormControl(0, [Validators.min(0), Validators.max(24)]),
      'finishedMinutes': new FormControl(0, [Validators.min(0), Validators.max(60)])
    });
  }

  guardarCambios() {
    this._firebase.setInit(this.formulario.value);
  }
}
