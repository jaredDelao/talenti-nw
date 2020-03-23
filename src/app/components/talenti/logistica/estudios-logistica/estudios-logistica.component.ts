import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { MatTableDataSource, MatPaginator, MatDatepicker, MatSidenav, MatSlideToggle } from '@angular/material';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { EstudiosAnalistaService } from 'src/app/services/analista/estudios-analista.service';
import * as bcryptjs from 'bcryptjs';
import { LogisticaService } from 'src/app/services/logistica/logistica.service';
import { EmpleadosService } from 'src/app/services/coordinador/empleados.service';
import { pluck, catchError } from 'rxjs/operators';
import { of } from 'rxjs';


@Component({
  selector: 'app-estudios-logistica',
  templateUrl: './estudios-logistica.component.html',
  styleUrls: ['./estudios-logistica.component.scss']
})
export class EstudiosLogisticaComponent implements OnInit {

  displayedColumns: string[] = ['folio', 'estudio', 'nombre', 'fecha_solicitud', 'estatus_agendado', 'detalles'];
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
  idLogistica: any = '19';
  idPerfil: any;

  catEmpleados = [];

  element: any = {};
  validarEstudio: any = 'PENDIENTE';
  validarPublicacionPreeliminar: boolean = false;

  banderaSupervisor: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, public estudiosAnalistaService: EstudiosAnalistaService, public logisticaService: LogisticaService, private empleadosService: EmpleadosService) { }

  ngOnInit() {
    this.verificarRolLogistica();
    this.formInit();
    this.getEmpleados();
    // this.getEstudios();
  }
  
  verificarRolLogistica() {
    // let idPerfil = '8';
    const idPerfil = localStorage.getItem('idPerfil');
    if (idPerfil) {
      // Rol logistica supervisor
      bcryptjs.compare('4', idPerfil, (err, res) => {
        if (res) {
          console.log('Es supervisor: ',res);
          this.displayedColumns = ['folio', 'estudio', 'nombre', 'fecha_solicitud', 'estatus_agendado', 'asignado', 'detalles'];
          
          this.banderaSupervisor = true;
          return this.getEstudiosSupervisor();
        }
        console.log(res); 
      });

      // Rol logistica normal
      bcryptjs.compare('8', idPerfil, (err, res) => {
        if (res) {
          this.banderaSupervisor = false;
          return this.getEstudiosByIdLogistica();
        }
        console.log('Es logistica ord: ', res); 
      });
    } else {
      return this.router.navigate(['/login']);
    }

    if (idPerfil == '4') {
      return this.getEstudiosSupervisor();
    }
    if (idPerfil == '8') {
      return this.getEstudiosByIdLogistica();
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
    this.banderaSupervisor = false;
    let params = {
      sService: 'getSolicitudesLogisticabyId',
      iIdLogistica: this.idLogistica
    }
    this.logisticaService.getSolicitudesLogisticaById(params).subscribe((res: any) => {
      console.log('res', res);
      this.estudiosList = res.resultado;
      this.getEstudios(res.resultado);
    })

  }

  getEstudiosSupervisor() {
    this.banderaSupervisor = true;
    this.logisticaService.getSolicitudesLogistica().subscribe((res: any) => {
      console.log('res', res);
      this.estudiosList = res.resultado;
      this.getEstudios(res.resultado);
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
        console.log(filter)
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
    console.log(this.banderaSupervisor);

    if (this.banderaSupervisor) {
      this.router.navigate(['logistica/detalle-estudio-supervisor/', data.iIdSolicitud]);
    } else {
      console.log(data.iIdSolicitud);
      
      this.router.navigate(['logistica/detalle-estudio-logistica/', data.iIdSolicitud]);
    }
    
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


}
