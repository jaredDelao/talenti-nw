import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, ThemeService, Color } from 'ng2-charts';
import { FormControl } from '@angular/forms';
import * as moment from 'moment'
import { GraficasService } from 'src/app/services/graficas.service';
import { pluck, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { EncriptarDesencriptarService } from 'src/app/services/encriptar-desencriptar.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

type Theme = 'light-theme' | 'dark-theme';

@Component({
  selector: 'app-grafica-talenti',
  templateUrl: './grafica-talenti.component.html',
  styleUrls: ['./grafica-talenti.component.scss']
})
export class GraficaTalentiComponent implements OnInit {

  request: any = {
    sService: 'getGraficaGralbyEjec',
    iIdEjecutivo: '',
    dfechaInicio: '',
    dFechaFin: ''
  };

  private _selectedTheme: Theme = 'light-theme';
  public barChartColors: Color[] = [
    { backgroundColor: '#17A589' },
    { backgroundColor: '#2E86C1' },
    { backgroundColor: '#D68910' },
    { backgroundColor: '#CB4335' },
    { backgroundColor: '#7D3C98' },
  ];


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

  // Date
  dateNow: any = new Date();

  constructor(public themeService: ThemeService, public graficasService: GraficasService, public encriptarService: EncriptarDesencriptarService, private router:Router) { }

  ngOnInit() {
    this.setCurrentTheme('dark-theme'); 
    this.getIdEjecutivo();  
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
      this.request.dfechaInicio = moment(fecha).format("YYYY-MM-DD");
    })
    this.fechaFinalForm.valueChanges.subscribe((fecha) => {
      // console.log(fecha);
      this.request.dFechaFin  = moment(fecha).format("YYYY-MM-DD");      
    })
  }

  getIdEjecutivo() {
    let idEjecutivo = localStorage.getItem('idEmpleado');
    if (!idEjecutivo) return this.router.navigate(['/']);

    this.encriptarService.desencriptar(idEjecutivo).subscribe((id) => {
      this.request.iIdEjecutivo = id;
    }, (err) => {
      this.router.navigate(['/']);
    })

  }

  buscar() {
    let fechaInicio = moment(this.request.dfechaInicio).format('DD-MMMM-YYYY').toString()
    let fechaFin =  moment(this.request.dFechaFin).format('DD-MMMM-YYYY').toString()
    this.barChartLabels = [fechaInicio + '   -   '+ fechaFin];
    
    this.graficasService.getGraficaCliente(this.request).pipe(
      pluck('LstDatos'),
      catchError((err) => of([]))
    )
    .subscribe((value: any[]) => {
      if (value.length <= 0) return Swal.fire('Aviso', 'Resultados no encontrados', 'warning');
      
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

  limpiar() {
    this.fechaInicioForm.reset();
    this.fechaFinalForm.reset();
    this.barChartData = [];
  }



}
