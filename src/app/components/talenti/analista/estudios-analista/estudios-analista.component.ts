import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDatepicker, MatSidenav, MatSlideToggle } from '@angular/material';
import { DatePipe } from '@angular/common';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { EstudiosAnalistaService } from 'src/app/services/analista/estudios-analista.service';

@Component({
  selector: 'app-estudios-analista',
  templateUrl: './estudios-analista.component.html',
  styleUrls: ['./estudios-analista.component.scss']
})
export class EstudiosAnalistaComponent implements OnInit {

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

  constructor(private fb: FormBuilder, private router: Router, public estudiosAnalistaService: EstudiosAnalistaService) { }

  ngOnInit() {
    this.formInit();
    this.getEstudios();
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
    this.estudiosAnalistaService.detalleSolicitud.next(data);
    this.router.navigate(['analista/detalle-estudio-analista/', data.iIdSolicitud]);
  }

  validarDeclinarEstudio() {
    let validar = this.element.bDeclinada;
    let declinar = this.element.bValidada;

    if (validar == '1' && declinar == '1') {
      return this.validarEstudio = 'DECLINADO';
    }
    if (validar == '1' && declinar == '0') {
      return this.validarEstudio = 'VALIDADO';
    }
    if (validar == '0' && declinar == '0') {
      return this.validarEstudio = 'PENDIENTE';
    }
  }

  publicarPreeliminar() {
    
      if (this.element.bPublicarPreliminar == '1') {
        this.togglePreliminar.checked = true;
        this.togglePreliminar.disabled = true;
      }
      if (this.element.bPublicarPreliminar == '0') {
        this.togglePreliminar.checked = false;
      }
  }
  changePublicarPreeliminar({checked}) {
    // console.log(checked);
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success ml-3',
          cancelButton: 'btn btn-danger mr-3'
        },
        buttonsStyling: false
      })
      
      swalWithBootstrapButtons.fire({
        title: '¿Deseas publicar el preliminar?',
        text: "Una vez publicado no podrás deshacer el cambio",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'PUBLICAR',
        cancelButtonText: 'CANCELAR',
        reverseButtons: true
      }).then((result) => {
        if (result.value) {
          this.togglePreliminar.checked = true;
          this.togglePreliminar.disabled =true;
        } else if (
          result.dismiss === Swal.DismissReason.cancel
        ) {
          this.togglePreliminar.checked = false;
        }
      })
    
    
  }



}
