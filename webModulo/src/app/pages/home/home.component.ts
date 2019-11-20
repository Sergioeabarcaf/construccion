import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  show = true;
  gaugeType = "semi";
  gaugeValue = 28.3;
  gaugeLabel = "Speed";
  gaugeAppendText = "km/hr";
  size = 150;

  constructor() { }

  ngOnInit() {
  }

}
