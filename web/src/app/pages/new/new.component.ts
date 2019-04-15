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
  nowDate: String = '';
  nowTime: String = '';

  constructor(public _auth0: Auth0Service, public _firebase: FirebaseService) {

    // Obtener fecha y hora en formato string
    this.nowDate = this.dateTime.getFullYear().toString() + '-' + this.appendZero(this.dateTime.getMonth() + 1) + '-' + this.appendZero(this.dateTime.getDate());
    this.nowTime = this.appendZero(this.dateTime.getHours()) + ':' + this.appendZero(this.dateTime.getMinutes())  + ':00';

    // Obtener perfil del usuario
    if (this._auth0.userProfile) {
      this.profile = this._auth0.userProfile;
    } else {
      this._auth0.getProfile((err, profile) => {
        this.profile = profile;
      });
    }
  }

  ngOnInit() {
    // Crear formulario con valores por defecto
    this.formulario = new FormGroup({
      'responsable': new FormControl(this.profile.name, Validators.required),
      'material': new FormControl('', Validators.required),
      'intervalTime': new FormControl('10', [Validators.required, Validators.min(10)]),
      'finishedType': new FormControl('manual', Validators.required),
      'finishedDate': new FormControl( this.nowDate ),
      'finishedTime': new FormControl( this.nowTime )
    });
  }

  // Enviar datos de formulario a firebase y inicializar el contenido de current en firebase
  sendForm() {
    this._firebase.current.He = 0;
    this._firebase.current.Hi = 0;
    this._firebase.current.Te = 0;
    this._firebase.current.Ti = 0;
    this._firebase.current.timestamp = '0';
    this._firebase.setInit(this.formulario.value);
  }

  // Validar que día, mes, hora y minuto tengan dos digitos.
  appendZero( num: number ) {
    if ( num < 10 ) {
      return '0' + num.toString();
    } else {
      return num.toString();
    }
  }
}
