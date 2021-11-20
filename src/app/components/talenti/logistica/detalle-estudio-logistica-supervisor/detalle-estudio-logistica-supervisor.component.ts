import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { of, Subject, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { map, pluck, flatMap, filter, toArray, catchError, takeUntil } from 'rxjs/operators';
import { EstudiosService } from 'src/app/services/ejecutivo/estudios.service';
import { EmpresasService } from 'src/app/services/coordinador/empresas.service';
import Swal from 'sweetalert2';
import { LogisticaService } from 'src/app/services/logistica/logistica.service';
import { EmpleadosService } from 'src/app/services/coordinador/empleados.service';

@Component({
  selector: 'app-detalle-estudio-logistica-supervisor',
  templateUrl: './detalle-estudio-logistica-supervisor.component.html',
  styleUrls: ['./detalle-estudio-logistica-supervisor.component.scss']
})
export class DetalleEstudioLogisticaSupervisorComponent implements OnInit, AfterViewInit, OnDestroy {

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
  costoEstudio: string;

  // Catalogos
  catLogistica = [];
  catAnalistas = [];
  catEstudios: any = [];
  param = {
    sService: "getLstEstudios",
    iIdEmpresa: 0
  }

  estudiosData = [];
  esGNP: boolean = false;
  esCliente: boolean = false;
  contadorAgendas: any;
  banderaAsignado: boolean = false;

  subs = new Subscription();
  subs1 = new Subscription();
  subs2 = new Subscription();
  $unsubscribe = new Subject();

  // Fecha hora
  controlLogistica = new FormControl(null, Validators.required);
  controlComentarios = new FormControl(null, Validators.required);

  // Tabla estatus
  dataTablaEstatus: any[] = [];
  columnasTablaEstatus: any[] = ['estatus_asignacion', 'estatus_agenda', 'estatus_aplicacion'];
  tipoEstudio: any = null;

  constructor(private fb: FormBuilder, private atp: AmazingTimePickerService, public empresasService: EmpresasService, public logisticaService: LogisticaService,
              private route: ActivatedRoute, private estudiosService: EstudiosService, private router: Router, public empleadosService: EmpleadosService) { }

  ngOnInit() {
    this.formInit();
    this.getUrlId();
    // this.getCatAnalistas();
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
          this.datosTablaEstatus(datosUsuario[0]);
          this.tipoEstudio = datosUsuario[0].iIdEstudio;
          this.idSolicitud = datosUsuario[0].iIdSolicitud;
          this.costoEstudio = datosUsuario[0].dCosto1;
          this.datosSolicitud = datosUsuario[0];
          this.contadorAgendas = datosUsuario[0].iContadoAgendas;
          this.controlLogistica.patchValue(datosUsuario[0].iIdEmpleadoLogistica);
          this.controlComentarios.patchValue(datosUsuario[0].sComentariosAsignacion);
  
          // Consulta datos
          this.setDatos(this.datosSolicitud);
  
          this.loading = false;
        } else {
          this.loading = false;
          Swal.fire('Error', 'No existe el estudio seleccionado', 'error').then(() => {
            return this.router.navigate(['/logistica/estudios-logistica']);
          })
        }
      }, (err) => {
        this.loading = false;
        return this.router.navigate(['/logistica/estudios-logistica']);
      }, (() => this.loading = false));
    } else  {
      this.loading = false;
      return this.router.navigate(['/logistica/estudios-logistica']);
    }    
  }

  datosTablaEstatus(data) {
    const {bDeclinada, bValidada, iIdEmpleadoLogistica, iContadoAgendas, bAgendaRealizada, bEstatusAsignacion, iEstatusGeneral, iEstatusDictamen, bPublicarDictamen} = data;
    this.dataTablaEstatus = [
      {bDeclinada, bValidada, iIdEmpleadoLogistica, iContadoAgendas, bAgendaRealizada, 
        bEstatusAsignacion, iEstatusGeneral, iEstatusDictamen, bPublicarDictamen
      }
    ]
  }

  getCatalogoEstudios() {
    this.subs1 = this.empresasService.getCatalogoEstudios(this.param).pipe(takeUntil(this.$unsubscribe)).subscribe((resp: any) => {
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
      iIdSolicitud: value.iIdSolicitud,
      dFechaSolicitud: value.dFechaSolicitud,
      iIdCliente: value.iIdCliente,
      iIdEstudio: value.iIdEstudio,
      analista: value.iIdAnalista,
      sFolio: value.sFolio,
      bPreliminar: value.bPreliminar,
      iIdAnalista: value.iIdAnalista,
      sComentarios: value.sComentarios,
      sNombres: value.sNombres,
      sApellidos: value.sApellidos,
      sPuesto: value.sPuesto,
      sTokenCV: value.sTokenCV,
      sTelefono: value.sTelefono,
      sNss: value.sNss,
      sCurp: value.sCurp,
      sCalleNumero: value.sCalleNumero,
      sColonia: value.sColonia,
      sCp: value.sCp,
      sMunicipio: value.sMunicipio,
      sEstado: value.sEstado,
      bDeclinada: value.bDeclinada,
      bValidada: value.bValidada,
      bPublicarDictamen: value.bPublicarDictamen,
      bSolicitarCalidad: value.bSolicitarCalidad,
      bCertificadoCalidad: value.bCertificadoCalidad,
      iPublicarPreliminar: value.iPublicarPreliminar,
    })

    // SetPreliminar
    if (value.iPublicarPreliminar > '0') {
      this.form.get('iPreliminar').patchValue('1')
    } else {
      this.form.get('iPreliminar').patchValue('0')
    }

  }

  regresarFunc() {
    this.router.navigate(['/logistica/estudios-logistica']);
  }

  estaAsignado() {
    return this.controlLogistica.value ? true : false;
  }


  asignar() {
    this.loading = true;

    if (this.controlComentarios.valid &&  this.controlLogistica.valid) {
      let req = {
        sService: 'asignarEstudioLogistica',
        iIdSolicitud: this.idSolicitud,
        empleadoLogisticaAsignado: this.controlLogistica.value,
        sComentarios: this.controlComentarios.value
      }      

      this.logisticaService.asignarLogistica(req).subscribe((resp: any) => {
        if (resp.resultado != 'Ok') {
          this.loading = false;
          return Swal.fire('Error', 'Error al asignar solicitud', 'error');
        }

        this.loading = false;
        return Swal.fire('Asignación exitosa', 'La solicitud se ha asignado exitosamente', 'success').then(() => {
          this.router.navigate(['/logistica/detalle-estudio-supervisor', this.idSolicitud]);
        })
      });
     } else {
       this.loading = false;
      return Swal.fire('Alerta', 'Faltan campos por llenar', 'warning')
    }
  }


}
