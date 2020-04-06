import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, ThemeService, Color } from 'ng2-charts';
import { FormControl } from '@angular/forms';
import * as moment from 'moment'
import { GraficasService } from 'src/app/services/graficas.service';
import { pluck, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

type Theme = 'light-theme' | 'dark-theme';


@Component({
  selector: 'app-grafica-cliente',
  templateUrl: './grafica-cliente.component.html',
  styleUrls: ['./grafica-cliente.component.scss']
})
export class GraficaClienteComponent implements OnInit, AfterViewInit {

  request: any = {
    sService: 'getGraficaGralbyEjec',
    iIdEjecutivo: '24',
    dfechaInicio: '2020-01-19',
    dFechaFin: '2020-04-21'
  };

  private _selectedTheme: Theme = 'light-theme';
  public barChartColors: Color[] = [
    { backgroundColor: '#17A589' },
    { backgroundColor: '#2E86C1' },
    { backgroundColor: '#D68910' },
    { backgroundColor: '#CB4335' },
    { backgroundColor: '#7D3C98' },
  ];

  fechaInicio: any;
  fechaFin: any;

  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [
    // { data: [65, 59, 80], label: 'PUBLICADAS'},
    // { data: [28, 48, 40], label: 'CANCELADAS'},
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

  fechaInicioForm = new FormControl(null);
  fechaFinalForm = new FormControl(null);

  constructor(public themeService: ThemeService, public graficasService: GraficasService) { }

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
            ticks: { fontColor: 'black' },
            gridLines: { color: 'rgba(255,255,255,0.8)' }
          }]
        }
      };
    } else {
      overrides = {};
    }
    this.themeService.setColorschemesOptions(overrides);
  }

  ngAfterViewInit() { 
    this.fechaInicioForm.valueChanges.subscribe((fecha) => {
      // console.log(fecha);
      this.fechaInicio = moment(fecha).format("YYYY-MM-DD");      
    })
    this.fechaFinalForm.valueChanges.subscribe((fecha) => {
      // console.log(fecha);
      this.fechaFin = moment(fecha).format("YYYY-MM-DD");      
    })
  }

  buscar() {

    this.barChartLabels = [this.fechaInicio + ' - ' + this.fechaFin];

    this.graficasService.getGraficaCliente(this.request).pipe(
      pluck('LstDatos'),
      catchError((err) => of([]))
    )
    .subscribe((value: any[]) => {
      var resp = [];
      value.map((row) => {
        let label;
        
        switch(row.EstatusHistorico) {
          case '1':
            label = 'Agendados';
            break;
          case '2':
            label = 'Publicados';
            break;
          case '3':
            label = 'Declinados';
            break;
          case '4':
            label = 'Validados';
            break;
          case '5':
            label = 'Cancelados';
            break;
        }

        let data = {
          data: [row.cantidad],
          label,
        }
        resp.push(data);
      })
      this.barChartData = resp;
      
    })
  }

}
// 1 agendados
// 2 publicados
// 3 declinados
// 4 validados
// 5 cancelados
