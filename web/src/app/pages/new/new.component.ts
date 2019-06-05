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
  sessionNumber: number;
  moduleAvailable = -1;

  constructor(public _auth0: Auth0Service, public _firebase: FirebaseService) {

    // Obtener fecha y hora en formato string
    this.nowDate = this.dateTime.getFullYear().toString() + '-' + this.appendZero(this.dateTime.getMonth() + 1) + '-' + this.appendZero(this.dateTime.getDate());
    this.nowTime = this.appendZero(this.dateTime.getHours()) + ':' + this.appendZero(this.dateTime.getMinutes())  + ':00';
    // Obtener los valores para las variables de sessionNumber y moduleAvailable.
    this.sessionNumber = _firebase.currentSessionNumber;
    this.getModuleAvailable();

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
      'startResponsable': new FormControl(this.profile.name, Validators.required),
      'sessionNumber': new FormControl(this.sessionNumber),
      'material': new FormControl('', Validators.required),
      'module': new FormControl(this.moduleAvailable, Validators.required),
      'timeInterval': new FormControl(30, [Validators.required, Validators.min(30)]),
      'endType': new FormControl('0', Validators.required),
      'endDate': new FormControl( this.nowDate ),
      'endTime': new FormControl( this.nowTime )
    });
    console.log(this.formulario);
  }

  // Enviar datos de formulario a firebase y inicializar el contenido de current en firebase
  sendForm() {
    this._firebase.current.timestamp = '0';
    this._firebase.current.thermal.He = 0;
    this._firebase.current.thermal.Hi = 0;
    this._firebase.current.thermal.Te = 0;
    this._firebase.current.thermal.Ti = 0;
    this._firebase.current.sound.He = 0;
    this._firebase.current.sound.Hi = 0;
    this._firebase.current.sound.Te = 0;
    this._firebase.current.sound.Ti = 0;
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

  getModuleAvailable() {
    // Si esta disponible thermal se asigna el valor 0
    if ( this._firebase.thermal.value === 0 && this._firebase.sound.value !== 0 ) {
      this.moduleAvailable = 0;
    }
    // Si esta disponible sound se asigna el valor 1
    if ( this._firebase.thermal.value !== 0 && this._firebase.sound.value === 0 ) {
      this.moduleAvailable = 1;
    }
    // Si estan ambos disponibles se asigna el valor 2
    if ( this._firebase.thermal.value === 0 && this._firebase.sound.value === 0 ) {
      this.moduleAvailable = 2;
    }
  }

}
