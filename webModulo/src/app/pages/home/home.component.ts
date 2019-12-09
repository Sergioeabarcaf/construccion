import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../../providers/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  show = true;
  gaugeType = "semi";
  size = 150;

  constructor(public _firebase: FirebaseService, public router:Router) {
    this._firebase.getDataSessionActive()
  }

  ngOnInit() {
  }

  goToGraph(param){
    this.router.navigate(['/graph', param]);
  }

}
