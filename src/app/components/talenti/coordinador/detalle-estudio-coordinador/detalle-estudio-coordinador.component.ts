import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { map, pluck, flatMap, filter, toArray, takeUntil } from 'rxjs/operators';
import { EstudiosService } from 'src/app/services/ejecutivo/estudios.service';
import { EmpresasService } from 'src/app/services/coordinador/empresas.service';
import Swal from 'sweetalert2';
import { LogisticaService } from 'src/app/services/logistica/logistica.service';
import { EmpleadosService } from 'src/app/services/coordinador/empleados.service';
import { MatChip, MatDialog, MatSlideToggle } from '@angular/material';
import { EstudiosAnalistaService } from 'src/app/services/analista/estudios-analista.service';
import { ModaKpiComponent } from '../../ejecutivo/modals/moda-kpi/moda-kpi.component';

@Component({
  selector: 'app-detalle-estudio-coordinador',
  templateUrl: './detalle-estudio-coordinador.component.html',
  styleUrls: ['./detalle-estudio-coordinador.component.scss']
})
export class DetalleEstudioCoordinadorComponent implements OnInit {
  @ViewChild('chip', {static: false}) chip: MatChip;  
  @ViewChild('slideToggle', {static: false}) slideToggle: MatSlideToggle;  

  preliminarList = [
    {nombre: 'SI', value: '1'},
    {nombre: 'NO', value: '0'},
  ];
  form: FormGroup;
  formAgenda: FormGroup;
  mostrarEstudiosCompletos: boolean = false;
  loading: boolean = false;
  idSolicitud: any;
  datosSolicitud: any;
  alertCancelado: any;
  empleadoAsignado: any;

  // Catalogos
  catTrueFalse = [
    { value: true, nombre: "Si" },
    { value: false, nombre: "No" },
  ]
  catLogistica = [];
  catAnalistas = [];
  catEstudios: any = [];
  param = {
    sService: "getLstEstudios",
    iIdEmpresa: 0
  }

  textCalidad: boolean = false;
  controlToggleCalidad = new FormControl(null, Validators.requiredTrue)

  estudiosData = [];
  esGNP: boolean = false;
  esCliente: boolean = false;
  contadorAgendas: any;
  banderaAsignado: boolean = false;

  subs = new Subscription();
  subs1 = new Subscription();
  subs2 = new Subscription();
  $unsubscribe = new Subject();

   // Tabla estatus
   dataTablaEstatus: any[] = [];
   columnasTablaEstatus: any[]= ['estatus_solicitud', 'estatus_asignacion', 'estatus_agenda', 'estatus_aplicacion', 'estatus_dictamen', 'estatus_preliminar','dictamen'];
   tipoEstudio: any = null;

  // Fecha hora
  controlComentarios = new FormControl(null, Validators.required);

  // Archivos
  archivoPreliminar: string = null;
  archivoComplemento: string = null;
  archivosDictamen = {
    arch1: null,
    arch2: null,
  }

  costoEstudio: string;

  constructor(private fb: FormBuilder, public empresasService: EmpresasService, public logisticaService: LogisticaService, private estudiosAnalistaService: EstudiosAnalistaService,
              private route: ActivatedRoute, private estudiosService: EstudiosService, private router: Router, public empleadosService: EmpleadosService, public dialog: MatDialog) { }

  ngOnInit() {
    this.formInit();
    this.getUrlId();
    this.getCatalogoEstudios();
    this.getCatLogistica();
  }

  ngAfterViewInit() {
    this.subs = this.form.get('iIdEstudio').valueChanges.subscribe(value => {
      if (value == 1 || value == 3 || value == 4 || value == 5 || value == 7 || value == 10 || value == 11 || value == 12) {
        this.mostrarEstudiosCompletos = true;
      }
      else {
        this.mostrarEstudiosCompletos = false;
      }
    });

  }

  ngOnDestroy() {
    this.subs.unsubscribe();
    this.subs1.unsubscribe();
    this.$unsubscribe.next(true);
    this.$unsubscribe.complete();
  }

 
  getCatLogistica() {
    this.empleadosService.getEmpleados().pipe(
      takeUntil(this.$unsubscribe),
      pluck('Empleados'),
    )
    .subscribe((empleados) => {
      this.catLogistica = empleados.filter((x) => x.iIdRol == '8');
      this.catAnalistas = empleados.filter((x) => x.iIdRol == '3');      
    })
  }


  getUrlId() {
    let idUrl = this.route.snapshot.paramMap.get('id');
    let req = {
      sService: 'getSolicitudById',
      IdSolicitud: idUrl,
    }

    
    if (idUrl) {
      this.loading = true;
      this.subs = this.estudiosService.getEstudioById(req).pipe(
          takeUntil(this.$unsubscribe),
          map((r) => r.resultado)
        ).subscribe((datosUsuario) => {
        if (datosUsuario[0]){
          console.log('Datos usuario::', datosUsuario[0]);

          this.setDatosComplemento(datosUsuario[0]);
          this.setDatosEstudioDictamen(datosUsuario[0]);
          this.setDatosPreliminar(datosUsuario[0]);

          this.datosTablaEstatus(datosUsuario[0]);
          this.tipoEstudio = datosUsuario[0].iIdEstudio;
          this.costoEstudio = datosUsuario[0].dCosto1;

          this.idSolicitud = datosUsuario[0].iIdSolicitud;
          // toggle calidad
          if (datosUsuario[0].bSolicitarCalidad == '2') {
            this.controlToggleCalidad.patchValue(true);
            this.controlToggleCalidad.disable();
          } else {
            this.controlToggleCalidad.setValue(false);
          }

          this.datosSolicitud = datosUsuario[0];
          this.contadorAgendas = datosUsuario[0].iContadoAgendas;
          this.controlComentarios.patchValue(datosUsuario[0].sComentariosAsignacion);
  
          // Consulta datos
          this.setDatos(this.datosSolicitud);
  
          this.loading = false;
        } else {
          this.loading = false;
          Swal.fire('Error', 'No existe el estudio seleccionado', 'error').then(() => {
            return this.router.navigate(['/calidad/estudios-calidad']);
          })
        }
      }, (err) => {
        this.loading = false;
        return this.router.navigate(['/calidad/estudios-calidad']);
      }, (() => this.loading = false));
    } else  {
      this.loading = false;
      return this.router.navigate(['/calidad/estudios-calidad']);
    }    
  }

  setDatosPreliminar(value) {
    this.archivoPreliminar = value.sArchivoPreliminar;
  }
  setDatosEstudioDictamen(value) {
    this.archivosDictamen.arch1= value.sArch1Dictamen;
    this.archivosDictamen.arch2 = value.sArch2Dictamen;
  }
  setDatosComplemento(value) {
    this.archivoComplemento = value.sTokenComplemento;
  }

  datosTablaEstatus(data) {
    const {bDeclinada, bValidada, iIdEmpleadoLogistica, iContadoAgendas, bAgendaRealizada, iPublicarPreliminar, bEstatusAsignacion, iEstatusGeneral, iEstatusDictamen, bPublicarDictamen} = data;
    this.dataTablaEstatus = [
      {bDeclinada, bValidada, iIdEmpleadoLogistica, iContadoAgendas, bAgendaRealizada, iPublicarPreliminar,
        bEstatusAsignacion, iEstatusGeneral, iEstatusDictamen, bPublicarDictamen
      }
    ]
  }

  getCatalogoEstudios() {
    this.subs1 = this.empresasService.getCatalogoEstudios(this.param).subscribe((resp: any) => {
      this.catEstudios = resp.LstEstudios;
    })
  }

  formInit() {
    this.form = this.fb.group({
      iIdSolicitud: new FormControl({value: '', disabled: true}),
      analista: new FormControl({value: '', disabled: true}),
      dFechaSolicitud: new FormControl({value: '', disabled: true}),
      iIdCliente: new FormControl({value: '', disabled: true}),
      iIdEstudio: new FormControl({value: '', disabled: true}),
      sFolio: new FormControl({value: '', disabled: true}),
      iPreliminar: new FormControl({value: '', disabled: true}),
      // iPublicarPreliminar: new FormControl({value: '', disabled: true}),
      iIdAnalista: new FormControl({value: '', disabled: true}),
      sComentarios: new FormControl({value: '', disabled: true}),
      sNombres: new FormControl({value: '', disabled: true}),
      sApellidos: new FormControl({value: '', disabled: true}),
      sPuesto: new FormControl({value: '', disabled: true}),
      sTokenCV: new FormControl({value: '', disabled: true}),
      sTelefono: new FormControl({value: '', disabled: true}),
      sNss: new FormControl({value: '', disabled: true}),
      sCurp: new FormControl({value: '', disabled: true}),
      sCalleNumero: new FormControl({value: '', disabled: true}),
      sColonia: new FormControl({value: '', disabled: true}),
      sCp: new FormControl({value: '', disabled: true}),
      sMunicipio: new FormControl({value: '', disabled: true}),
      sEstado: new FormControl({value: '', disabled: true}),
      bDeclinada: new FormControl({value: '', disabled: true}),
      bValidada: new FormControl({value: '', disabled: true}),
      bPublicarDictamen: new FormControl({value: '', disabled: true}),
      bSolicitarCalidad: new FormControl({value: '', disabled: true}),
      bCertificadoCalidad: new FormControl({value: '', disabled: true}),
      iPublicarPreliminar: new FormControl({value: '', disabled: true}),

    })
  }

  setDatos(value) {
    this.form.patchValue({
      ...value,
      analista: value.iIdAnalista
    });
    // SetPreliminar
    if (value.iPublicarPreliminar > '0') {
      this.form.get('iPreliminar').patchValue('1')
    } else {
      this.form.get('iPreliminar').patchValue('0')
    }
  }

  regresarFunc() {
    this.router.navigate(['/calidad/estudios-calidad']);
  }

  aprobar() {

    if (this.controlToggleCalidad.value == true) {

      Swal.fire({
        title: 'Aprobar calidad',
        text: "¿Estás seguro que deseas aprobar el certificado de calidad?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aprobar',
        cancelButtonText: 'cancelar',
      }).then((result: any) => {        
        if (result.value) {
          let req = {
            sService: 'aprobarCalidad',
            iIdSolicitud: this.idSolicitud
          }
          this.estudiosService.aprobarCalidad(req).subscribe((resp: any) => {
            if (resp.resultado != 'Ok') {
              this.controlToggleCalidad.patchValue(false);
              return Swal.fire('Error', 'Error al aprobar calidad ' + resp.resultado, 'error')
            };
            Swal.fire('Alerta', 'El estudio ha sido aprobado exitosamente', 'success');
            this.controlToggleCalidad.disable();
          })
        } else {
          this.controlToggleCalidad.patchValue(false);
        }
      });
      
    } else {
      event.preventDefault();
    }
  }


  // DESCARGA CV
  descargarCV() {
    if (this.form.get('sTokenCV').value) {
      let req = {
        token: this.form.get('sTokenCV').value,
      }
      this.estudiosAnalistaService.descargarPreliminar(req);
    }
  }

  descargar(token) {
    let reqParams = {token}
    this.estudiosAnalistaService.descargarPreliminar(reqParams);
  }

  abrirModalKpis() {
    this.dialog.open(ModaKpiComponent, {
      data: {
        idEstudio: this.idSolicitud
      },
      maxHeight: '600px'
      // width: '100%',
    })
  }
}
