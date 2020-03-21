import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { MatTableDataSource, MatPaginator, MatDatepicker, MatSidenav, MatSlideToggle } from '@angular/material';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { EstudiosAnalistaService } from 'src/app/services/analista/estudios-analista.service';
import * as bcryptjs from 'bcryptjs';


@Component({
  selector: 'app-estudios-logistica',
  templateUrl: './estudios-logistica.component.html',
  styleUrls: ['./estudios-logistica.component.scss']
})
export class EstudiosLogisticaComponent implements OnInit {

  displayedColumns: string[] = ['folio', 'estudio', 'nombre', 'fecha_solicitud', 'estatus_solicitud', 'comentarios'];
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

  element: any = {};
  validarEstudio: any = 'PENDIENTE';
  validarPublicacionPreeliminar: boolean = false;

  banderaSupervisor: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, public estudiosAnalistaService: EstudiosAnalistaService) { }

  ngOnInit() {
    this.verificarRolLogistica();
    this.formInit();
    this.getEstudios();
  }

  verificarRolLogistica() {
    let idPerfil = localStorage.getItem('idPerfil');
    if (idPerfil) {
      // Rol logistica supervisor
      bcryptjs.compare('6', idPerfil, (err, res) => {
        if (res) {
          this.banderaSupervisor = true;
          return this.getEstudiosSupervisor();
        }
        console.log(res); 
      });

      // Rol logistica normal
      bcryptjs.compare('7', idPerfil, (err, res) => {
        if (res) {
          this.banderaSupervisor = false;
          return this.getEstudiosByIdLogistica();
        }
        console.log(res); 
      });
    } else {
      return this.router.navigate(['/login']);
    }
  }

  getEstudiosByIdLogistica() {}

  getEstudiosSupervisor() {}

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

  getEstudios() {
    this.estudiosAnalistaService.getEstudios(this.req).subscribe((estudiosList: any)=> {
      console.log(estudiosList);
      const {resultado} = estudiosList;
      this.estudiosList = resultado;
      this.dataSource = new MatTableDataSource(this.estudiosList);
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
    });
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
      this.router.navigate(['detalle-estudio-logistica/', data.iIdSolicitud]);
    }
    
  }


}
