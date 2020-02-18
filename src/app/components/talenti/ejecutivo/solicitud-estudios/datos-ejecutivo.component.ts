import { Component, OnInit, ViewChild, DoCheck, Output, EventEmitter, AfterViewInit, AfterViewChecked, ChangeDetectorRef } from "@angular/core";
import { DatosEjecutivo } from "../../../../interfaces/datos-ejecutivo";
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from "@angular/material/table";
import { MatDatepicker, MatDatepickerInputEvent, MatSidenav, MatSlideToggle } from '@angular/material';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { EstudiosService } from 'src/app/services/ejecutivo/estudios.service';
import { Estudios, Estudio } from 'src/app/interfaces/talenti/ejecutivo/estudios';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ModalDireccionComponent } from '../modals/modal-direccion/modal-direccion.component';
import Swal from 'sweetalert2';

@Component({
  selector: "app-datos-ejecutivo",
  templateUrl: "./datos-ejecutivo.component.html",
  styleUrls: ["./datos-ejecutivo.component.scss"]
})
export class DatosEjecutivoComponent implements OnInit {

  displayedColumns: string[] = [
    'folio', 'estudio', 'nombre', 'fecha_solicitud', 'estatus_solicitud', 'comentarios'
  ];
  // displayedColumns: string[] = [
  //   'folio', 'estudio', 'nombre', 'direccion', 'fecha_solicitud', 'hora_solicitud', 'estatus_solicitud', 
  //   'estatus_agendado', 'fecha_agenda', 'estatus_aplicacion', 'fecha_aplicacion', 'preliminar', 'publicacion_preliminar', 
  //   'estatus_preliminar', 'publicacion_estudio', 'descarga',  'publicacion_dictamen', 'estatus_dictamen',
  //   'solicitar_calidad', 'certificado_calidad', 'solicitud_cancelacion', 'tipo_cancelacion', 'aprobar_cancelacion',
  //   'evidencia', 'comentarios'
  // ];
  dataSource: MatTableDataSource<Estudio>;

  req = {
    sService: 'getSolicitudesEjecutivo',
    iIdEjecutivo: '1'
  }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('fechaI', { static: false }) fechaI: MatDatepicker<any>;
  @ViewChild('fechaF', { static: false }) fechaF: MatDatepicker<any>;
  @ViewChild('sidenav', {static: false}) detallesMenu: MatSidenav;

  @ViewChild('togglePublicarPreliminar', {static: false}) togglePreliminar: MatSlideToggle;
  @ViewChild('togglePublicarDictamen', {static: false}) toggleDictamen: MatSlideToggle;

  // @Output() fechaInicioEvent: EventEmitter<MatDatepickerInputEvent<any>>;
  // @Output() fechaFinEvent: EventEmitter<MatDatepickerInputEvent<any>>; (dateChange)="fechaFinEvent($event)"
  fechaInicio: Date;
  fechaFin: Date;
  estudiosList: Array<any>;
  form: FormGroup;

  element: any = {};
  validarEstudio: any = 'PENDIENTE';
  validarPublicacionPreeliminar: boolean = false;

  constructor(private estudiosService: EstudiosService, private fb: FormBuilder,
    public dialog: MatDialog, private cd: ChangeDetectorRef) {
    this.getEstudios();
  }

  ngOnInit() {
    this.formInit();
  }

  // Direccion modal
  verDireccion(estado, municipio) {
    let direccion = {estado, municipio};
    this.openDialogDireccion(direccion);
  }

  openDialogDireccion(direccion): void {
    const dialogRef = this.dialog.open(ModalDireccionComponent, {
      width: '400px',
      data: direccion
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  

  formInit() {
    this.form = this.fb.group({
      fechaInicioForm: new FormControl({ value: '', disabled: true }),
      fechaFinalForm: new FormControl({ value: '', disabled: true }),
    })
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getEstudios() {
    this.estudiosService.getEstudios(this.req).subscribe((estudiosList: any)=> {
      console.log(estudiosList);

      const {resultado} = estudiosList;
      this.estudiosList = resultado;
      this.dataSource = new MatTableDataSource(this.estudiosList);
      this.dataSource.paginator = this.paginator;

      // console.log(this.dataSource);
      
    })
  }

  detalles(data) {
    this.detallesMenu.toggle();
    this.element = data;
    this.validarDeclinarEstudio();
    this.publicarPreeliminar();
    console.log(this.element);
  }

  validarDeclinarEstudio() {
    let validar = this.element.bDeclinada;
    let declinar = this.element.bValidada;

    // false - declinado
    // true - validado
    // '3' - pendiente

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
