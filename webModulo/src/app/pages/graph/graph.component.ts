import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EChartOption } from 'echarts';
import { FirebaseService } from '../../providers/firebase.service';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {

  dataReady = false;

  chartOption: EChartOption = {
    title: {
      text: '',
      left: 'center'
    },
    xAxis: {
      type: 'category',
      data: []
    },
    yAxis: {
      type: 'value'
    },
    legend: {
      left: 'right',
      data: ['Interior', 'Exterior']
    },
    series: [{
      name: "Interior",
      data: [],
      type: 'line'
    }, {
      name: "Exterior",
      data: [],
      type: 'line'
    }]
  }

  title = "";

  data:any;

  constructor(public activatedRoute: ActivatedRoute, public router: Router, public _firebase: FirebaseService) {
    this._firebase.getDataSessionActive();
    this.activatedRoute.params.subscribe( param => {
      console.log(param.id);
      if(param.param == 'T') {
        this.chartOption.title['text'] = 'Temperatura Ambiental';
        this._firebase.getDataSessionActivePromise.then( (res:any[]) => {
          res.forEach( data => {
            this.chartOption.xAxis['data'].push(data.timestamp);
            this.chartOption.series[0]['data'].push(data.Ti);
            this.chartOption.series[1]['data'].push(data.Te);
            this.dataReady = true;
          });
        });
      }
      if(param.param == 'H') {
        this.chartOption.title['text'] = 'Humedad Ambiental';
        this._firebase.getDataSessionActivePromise.then( (res:any[]) => {
          res.forEach( data => {
            this.chartOption.xAxis['data'].push(data.timestamp);
            this.chartOption.series[0]['data'].push(data.Hi);
            this.chartOption.series[1]['data'].push(data.He);
            this.dataReady = true;
          });
        });
      }
      if(param.param == 'TObj') {
        this.chartOption.title['text'] = 'Temperatura Material';
        this._firebase.getDataSessionActivePromise.then( (res:any[]) => {
          res.forEach( data => {
            this.chartOption.xAxis['data'].push(data.timestamp);
            this.chartOption.series[0]['data'].push(data.TObj);
            this.chartOption.series[1]['data'].push(data.TObj);
            this.dataReady = true;
          });
        });
      }
      
    });
  }

  ngOnInit() {
  }

}
