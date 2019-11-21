import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EChartOption } from 'echarts';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {

  chartOption: EChartOption = {
    title: {
      text: '',
      left: 'center'
    },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
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
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: 'line'
    }, {
      name: "Exterior",
      data: [300, 350, 400, 450, 500, 600, 1000],
      type: 'line'
    }]
  }

  title = "";

  constructor(public activatedRoute: ActivatedRoute, public router: Router) {
    this.activatedRoute.params.subscribe( param => {
      console.log(param.id);
      if(param.param == 'T') {
        this.chartOption.title['text'] = 'Temperatura Ambiental';
      }
      if(param.param == 'H') {
        this.chartOption.title['text'] = 'Humedad Ambiental';
      }
      if(param.param == 'TObj') {
        this.chartOption.title['text'] = 'Temperatura Material';
      }
      
    });
  }

  ngOnInit() {
  }

}
