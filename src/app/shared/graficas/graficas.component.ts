import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, ThemeService, Color } from 'ng2-charts';

type Theme = 'light-theme' | 'dark-theme';


@Component({
  selector: 'app-graficas',
  templateUrl: './graficas.component.html',
  styleUrls: ['./graficas.component.scss']
})
export class GraficasComponent implements OnInit {


  private _selectedTheme: Theme = 'light-theme';
  public barChartColors: Color[] = [
    { backgroundColor: '#2471A3' },
    { backgroundColor: '#45B39D' },
  ]

  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[] = ['ENERO', 'FEBRERO', 'MARZO'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [
    { data: [65, 59, 80], label: 'PUBLICADAS'},
    { data: [28, 48, 40], label: 'CANCELADAS'},
  ];

  resp = {
    options: [
      {
        data: [23, 12, 89],
        label: 'Solicitudes canceladas',
      }
    ],
    labels: ['ENERO', 'FEBRERO', 'MARZO']
  }

  constructor(public themeService: ThemeService) { }

  ngOnInit() {
    this.setCurrentTheme('dark-theme');
  }

  setCurrentTheme(theme: Theme) {
    this.selectedTheme = theme;
  }

  public get selectedTheme() {
    return this._selectedTheme;
  }

  public set selectedTheme(value) {
    this._selectedTheme = value;
    let overrides: ChartOptions;
    if (this.selectedTheme === 'dark-theme') {
      overrides = {
        legend: {
          labels: { fontColor: 'black' }
        },
        scales: {
          xAxes: [{
            ticks: { fontColor: 'white' },
            gridLines: { color: 'rgba(255,255,255,0.1)' }
          }],
          yAxes: [{
            ticks: { fontColor: 'white' },
            gridLines: { color: 'rgba(255,255,255,0.1)' }
          }]
        }
      };
    } else {
      overrides = {};
    }
    this.themeService.setColorschemesOptions(overrides);
  }

}
