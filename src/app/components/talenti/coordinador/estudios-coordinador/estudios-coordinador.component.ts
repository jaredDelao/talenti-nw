import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { MatTableDataSource, MatPaginator, MatDatepicker, MatSidenav, MatSlideToggle } from '@angular/material';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { EstudiosAnalistaService } from 'src/app/services/analista/estudios-analista.service';
import { LogisticaService } from 'src/app/services/logistica/logistica.service';
import { EmpleadosService } from 'src/app/services/coordinador/empleados.service';
import { pluck, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { EstudiosService } from 'src/app/services/ejecutivo/estudios.service';
import { VerificarEstatusService } from 'src/app/services/verificar-estatus.service';

@Component({
  selector: 'app-estudios-coordinador',
  templateUrl: './estudios-coordinador.component.html',
  styleUrls: ['./estudios-coordinador.component.scss']
})
export class EstudiosCoordinadorComponent implements OnInit {
  displayedColumns: string[] = ['folio', 'nombre', 'fecha_solicitud', 'estatus_agenda', 'estatus_aplicacion', 'fecha_preliminar', 'fecha_publicacion', 'detalles'];
  dataSource: MatTableDataSource<any>;

  // request getEstudios
  req = {
    sService: 'getSolicitudesAnalista',
    iIdAnalista: '1'
  }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('fechaI', { static: false }) fechaI: MatDatepicker<any>;
  @ViewChild('fechaF', { static: false }) fechaF: MatDatepicker<any>;
  @ViewChild('sidenav', {static: false}) detallesMenu: MatSidenav;

  @ViewChild('togglePublicarPreliminar', {static: false}) togglePreliminar: MatSlideToggle;
  @ViewChild('togglePublicarDictamen', {static: false}) toggleDictamen: MatSlideToggle;

  fechaInicio: Date;
  fechaFin: Date;
  pipe: DatePipe;
  estudiosList: Array<any>;
  form: FormGroup;
  idPerfil: any;

  catEmpleados = [];

  element: any = {};
  validarEstudio: any = 'PENDIENTE';
  validarPublicacionPreeliminar: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, public estudiosAnalistaService: EstudiosAnalistaService, public logisticaService: LogisticaService, 
    private empleadosService: EmpleadosService, public estudiosService: EstudiosService, public vEstatusService: VerificarEstatusService) { }

  ngOnInit() {
    this.formInit();
    this.getEstudiosCalidad();
    this.getEmpleados();
    // this.getEstudios();
    this.paginator._intl.itemsPerPageLabel = 'Estudios por página:';
    this.paginator.pageSize = 50;

  }

  getEmpleados() {
    this.empleadosService.getEmpleados().pipe(
      pluck('Empleados'),
      catchError((err) => of([]))
    )
    .subscribe((resp) => {
      this.catEmpleados = resp;
    })
  }

  getEstudiosCalidad() {
    this.estudiosService.getSolicitudesCalidad().subscribe((res: any) => {
      this.estudiosList = res.LstEstudios;
      this.getEstudios(res.LstEstudios);
    })

  }

  get fromDate() {
    return this.form.get('fechaInicioForm').value;
  }
  get toDate() {
    return this.form.get('fechaFinalForm').value;
  }  

  formInit() {
    this.form = this.fb.group({
      fechaInicioForm: new FormControl({ value: '', disabled: true }),
      fechaFinalForm: new FormControl({ value: '', disabled: true }),
    })
  }

  filterFechas() {
    this.dataSource.filter = 'fecha';
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getEstudios(estudios) {
      this.dataSource = new MatTableDataSource(estudios);
      this.dataSource.paginator = this.paginator;

      // Filtro fecha - texto
      this.dataSource.filterPredicate = (data: any, filter) => {
        if (filter == 'fecha') {
          if (this.fromDate && this.toDate) {
            let nFrom = moment(this.fromDate, "YYYY-MM-DD").format();
            let nTo = moment(this.toDate, "YYYY-MM-DD").format();
            return data.dFechaSolicitud >= nFrom && data.dFechaSolicitud <= nTo
          }
        } else {
          let text = (data.sNombres.concat(' ',data.sApellidos));
          return text.toLowerCase().includes(filter.trim().toLowerCase()); 
        }
        return true;
      }
  }

  clear() {
      this.dataSource.filter = '';
      this.form.reset();
  }


  detalles(data) {
    this.router.navigate(['/coordinador/detalle-estudio-coordinador/', data.iIdSolicitud]);
  }

  estatusAgenda(estatus) {
    switch(estatus) {
      case '0':
        return 'Sin agenda'
      case '1':
        return 'Agendado'
      case '2':
        return 'Reagendado'
      case '3':
        return 'Reagendado'
      case '4':
        return 'Cancelado'

      default:
        return 'Sin estatus'
    } 
  }

  empleadoAsignado(idempleado) {
    const empleado = this.catEmpleados.find((value) => value.iIdEmpleado == idempleado);
    if (empleado) {
      return empleado.sNombres + ' ' + empleado.sApellidos;
    } else {
      return 'Sin asignar'
    }
  }

  verificarEstatusSolicitud(element) {

    const { bDeclinada, bValidada, bPublicarDictamen, bSolicitarCalidad, iPublicarPreliminar, iEstatusComplemento } = element;

    let complementoPend = false;
    let preliminarPend = false;

    if (iEstatusComplemento > '0' && iEstatusComplemento != '3') complementoPend = true;
    if (iPublicarPreliminar > '0' && iPublicarPreliminar != '3') preliminarPend = true;

    if (bPublicarDictamen == '2' || iPublicarPreliminar == '2' || iEstatusComplemento == '4') return 'Revisar'
        
    if (bPublicarDictamen == '3' && !complementoPend && !preliminarPend ) return 'Validado'
    
    return 'Pendiente';
  }

  color(row) {
    return {'background-color': 'transparent'}
  }

  verText(e: HTMLSpanElement) {
    let text = e.innerText;

    if (text == 'Pendiente') return 'priority_high';
    if (text == 'Validado') return 'done';
    if (text == 'Revisar') return 'search';
  }

  verColor(e: HTMLSpanElement) {
    let text = e.innerText;
    if (text == 'Pendiente') return {'color': 'red'};
    if (text == 'Validado') return {'color': '#27AE60'};
    if (text == 'Revisar') return {'color': '#F5B041'};
  }

  verificarEstatusDictamen(bPublicarDictamen, iEstatusGeneral) {
    return this.vEstatusService.verificarEstatusDictamen(bPublicarDictamen, iEstatusGeneral);
  }

  verificarDictamen(idDictamen, iEstatusGeneral) {
    return this.vEstatusService.verificarDictamen(idDictamen, iEstatusGeneral);  
  }

}
