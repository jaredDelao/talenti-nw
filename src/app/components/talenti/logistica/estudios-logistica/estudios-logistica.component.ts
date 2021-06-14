import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { MatTableDataSource, MatPaginator, MatDatepicker, MatSidenav, MatSlideToggle, MatSort } from '@angular/material';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { EstudiosAnalistaService } from 'src/app/services/analista/estudios-analista.service';
import * as bcryptjs from 'bcryptjs';
import { LogisticaService } from 'src/app/services/logistica/logistica.service';
import { EmpleadosService } from 'src/app/services/coordinador/empleados.service';
import { pluck, catchError, flatMap, filter, tap, toArray } from 'rxjs/operators';
import { of } from 'rxjs';
import { EncriptarDesencriptarService } from 'src/app/services/encriptar-desencriptar.service';
import { VerificarEstatusService } from 'src/app/services/verificar-estatus.service';
import { GenerateExcelService } from 'src/app/services/generate-excel.service';


@Component({
  selector: 'app-estudios-logistica',
  templateUrl: './estudios-logistica.component.html',
  styleUrls: ['./estudios-logistica.component.scss']
})
export class EstudiosLogisticaComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('fechaI', { static: false }) fechaI: MatDatepicker<any>;
  @ViewChild('fechaF', { static: false }) fechaF: MatDatepicker<any>;
  @ViewChild('sidenav', {static: false}) detallesMenu: MatSidenav;

  @ViewChild('togglePublicarPreliminar', {static: false}) togglePreliminar: MatSlideToggle;
  @ViewChild('togglePublicarDictamen', {static: false}) toggleDictamen: MatSlideToggle;

  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<any>;

  fechaInicio: Date;
  fechaFin: Date;
  pipe: DatePipe;
  estudiosList: Array<any>;
  form: FormGroup;
  idLogistica: any = '19';
  idPerfil: any;

  loader: boolean = false;

  catEmpleados = [];

  element: any = {};
  validarEstudio: any = 'PENDIENTE';
  validarPublicacionPreeliminar: boolean = false;

  banderaSupervisor: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, public estudiosAnalistaService: EstudiosAnalistaService, public logisticaService: LogisticaService, private empleadosService: EmpleadosService, private encryptDecryptService: EncriptarDesencriptarService, public vEstatusService: VerificarEstatusService,
    private excelGenerate: GenerateExcelService) { }

  async ngOnInit() {
    this.formInit();
    this.idLogistica = await this.getIdLogistica();
    this.verificarRolLogistica();
    this.getEmpleados();

  }

  ngAfterViewInit() {
  }

  getIdLogistica() {
    let idClienteEncrypt = localStorage.getItem('idEmpleado');
    return this.encryptDecryptService.desencriptar(idClienteEncrypt).toPromise();
  }
  
  verificarRolLogistica() {
    // let idPerfil = '8';
    const idPerfil = localStorage.getItem('idPerfil');
    if (idPerfil) {
      // Rol logistica supervisor
      bcryptjs.compare('4', idPerfil, (err, res) => {
        if (res) {
          console.log('Es supervisor: ',this.idLogistica);
          this.displayedColumns = ['sFolio', 'sNombres', 'sNombreEmpresa', 'sNombreEstudio', 'dFechaSolicitud', 'dFechaAplicacion','iContadoAgendas', 'estatus_aplicacion', 'detalles'];
          this.banderaSupervisor = true;
          return this.getEstudiosSupervisor();
        }
      });

      // Rol logistica normal
      bcryptjs.compare('8', idPerfil, (err, res) => {
        if (res) {
          console.log('Es normal', this.idLogistica);
          this.displayedColumns = ['sFolio', 'sNombres', 'sNombreEmpresa', 'sNombreEstudio', 'dFechaSolicitud', 'dFechaAplicacion', 'iContadoAgendas','estatus_aplicacion', 'detalles'];
          this.banderaSupervisor = false;
          return this.getEstudiosByIdLogistica();
        }
      });
    } else {
      return this.router.navigate(['/login']);
    }
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

  getEstudiosByIdLogistica() {
    this.loader = true;
    this.banderaSupervisor = false;
    let params = {
      sService: 'getSolicitudesLogisticabyId',
      iIdLogistica: this.idLogistica
    }
    this.logisticaService.getSolicitudesLogisticaById(params).pipe(
      pluck('resultado'),
      // flatMap((v: any) => v),
      // tap((v) => console.log(v)),
      // filter((row: any) => row.iIdEstudio != '2'),
      // toArray(),
      catchError((err) => of([]))
    )
    .subscribe((res: any) => {
      this.estudiosList = res;
      this.getEstudios(res);
      this.loader = false;
    }, (err) => {this.loader = false}, () => this.loader = false)

  }

  getEstudiosSupervisor() {
    this.loader = true;
    this.banderaSupervisor = true;
    this.logisticaService.getSolicitudesLogistica().pipe(
      pluck('resultado'),
      // flatMap((v: any) => v),
      // tap((v) => console.log(v)),
      // filter((row: any) => row.iIdEstudio != '2'),
      // toArray(),
      catchError((err) => of([]))
    )
    .subscribe((res: any) => {
      if (res.length <= 0) return Swal.fire('Aviso', 'No se encontraron resultados', 'warning');
      this.estudiosList = res;
      this.getEstudios(res);
      this.loader = false;
    }, (err) => {this.loader = false}, () => this.loader = false)

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
      // this.paginator.pageSize = 50;
      // this.paginator._intl.itemsPerPageLabel = 'Estudios por página:';
      this.dataSource.sort = this.sort;

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
    if (this.banderaSupervisor) {
      this.router.navigate(['/logistica/detalle-estudio-supervisor/', data.iIdSolicitud]);
    } else {      
      this.router.navigate(['/logistica/detalle-estudio-logistica/', data.iIdSolicitud]);
    }
  }

  // verificarEstatusAgenda(iContadoAgendas) {
  //   return this.vEstatusService.verificarEstatusAgenda(iContadoAgendas);
  // }

  // verificarEstatusAplicacion(bEstatusAsignacion, iEstatusGeneral) {
  //   return this.vEstatusService.verificarEstatusAplicacion(bEstatusAsignacion, iEstatusGeneral);
  // }

  // verificarEstatusAsignacion(iIdEmpleadoLogistica) {
  //   if (!iIdEmpleadoLogistica) return 'SIN ASIGNAR'
  //   const empleadoLogistica = this.catEmpleados.find((value) => value.iIdEmpleado == iIdEmpleadoLogistica);
  //   return empleadoLogistica.sNombres + ' ' + empleadoLogistica.sApellidos;
  // }

  // verificarEstatusSolicitud(element) {

  //   const { bDeclinada, bValidada, bPublicarDictamen, bSolicitarCalidad, iPublicarPreliminar, iEstatusComplemento } = element;

  //   let complementoPend = false;
  //   let preliminarPend = false;

  //   if (iEstatusComplemento > '0' && iEstatusComplemento != '3') complementoPend = true;
  //   if (iPublicarPreliminar > '0' && iPublicarPreliminar != '3') preliminarPend = true;

  //   if (bPublicarDictamen == '2' || iPublicarPreliminar == '2' || iEstatusComplemento == '4') return 'Revisar'
        
  //   if (bPublicarDictamen == '3' && !complementoPend && !preliminarPend ) return 'Validado'
    
  //   return 'Pendiente';


  exportExcel() {
    this.loader = true;
    let data: Array<any> = this.dataSource.filteredData;

    const exportExc = data.reduce((acc, v) => {
        let arr = [
          v.sFolio ? v.sFolio : v.iIdSolicitud,
          v.sNombres, 
          v.sApellidos, 
          v.dFechaSolicitud,
          this.verificarEstatusAgenda(v.iContadoAgendas),
          this.verificarEstatusAplicacion(v.iEstatusGeneral ,v.bEstatusAsignacion),
        ];
        acc.push(arr);
        return acc;
    }, [])
    

    let headers = ['Folio', 'Nombre', 'Apellidos', 'Fecha Solicitud', 'Estatus Agenda', 'Estatus Aplicación'];

    this.excelGenerate.createExcel('exportExc', headers, exportExc );
    // this.ngOnInit();
    this.loader = false;
  }



  color(row) {
    if (row.bDeclinada == '1') {
      return {'background-color': '#FEC6C0'}
    }
    if (row.bValidada == '1') {
      return {'background-color': '#D5F5E3'}
    }
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

  reload() {
    this.ngOnInit();
  }

  verificarRol(iIdEmpleadoLogistica) {
    if (this.banderaSupervisor) {
      if (!iIdEmpleadoLogistica) return {'background-color': '#F9E79F'} 
    }

    if (!this.banderaSupervisor) {
      if (!iIdEmpleadoLogistica) return {'background-color': '#F9E79F'} 
    }
  }


  verificarEstatusAgenda(iContadoAgendas) {
    switch(iContadoAgendas) {
      case '0':
        return 'PENDIENTE'
      case '1':
        return 'AGENDADO'
      case '2':
        return 'REAGENDADO'
      case '3':
        return 'REAGENDADO'
      case '4':
        return 'CANCELADO'

      default:
        return '-'
    } 
  }

  verificarEstatusAplicacion(iEstatusGeneral,bEstatusAsignacion ) {
    if (iEstatusGeneral == '4') return 'CANCELADO';
    if (!bEstatusAsignacion || bEstatusAsignacion == '0') return 'PENDIENTE'; 
    if (bEstatusAsignacion == '1') return 'EXITOSO'; 
  }

}
