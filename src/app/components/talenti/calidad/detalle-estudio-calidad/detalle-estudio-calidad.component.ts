import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { map, pluck, flatMap, filter, toArray } from 'rxjs/operators';
import { EstudiosService } from 'src/app/services/ejecutivo/estudios.service';
import { EmpresasService } from 'src/app/services/coordinador/empresas.service';
import Swal from 'sweetalert2';
import { LogisticaService } from 'src/app/services/logistica/logistica.service';
import { EmpleadosService } from 'src/app/services/coordinador/empleados.service';
import { MatChip, MatSlideToggle } from '@angular/material';

@Component({
  selector: 'app-detalle-estudio-calidad',
  templateUrl: './detalle-estudio-calidad.component.html',
  styleUrls: ['./detalle-estudio-calidad.component.scss']
})
export class DetalleEstudioCalidadComponent implements OnInit {

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
  catLogistica = [];
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

   // Tabla estatus
   dataTablaEstatus: any[] = [];
   columnasTablaEstatus: any[]= ['estatus_solicitud', 'estatus_asignacion', 'estatus_agenda', 'estatus_aplicacion', 'estatus_dictamen', 'estatus_preliminar','dictamen'];
   tipoEstudio: any = null;

  // Fecha hora
  controlComentarios = new FormControl(null, Validators.required);

  constructor(private fb: FormBuilder, public empresasService: EmpresasService, public logisticaService: LogisticaService,
              private route: ActivatedRoute, private estudiosService: EstudiosService, private router: Router, public empleadosService: EmpleadosService) { }

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
  }

  getCatLogistica() {
    this.empleadosService.getEmpleados().pipe(
      pluck('Empleados'),
      flatMap((resp) => resp),
      filter((value) => value.iIdRol == '8'),
      toArray()
    )
    .subscribe((empleados) => {
      this.catLogistica = empleados;
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
      this.subs = this.estudiosService.getEstudioById(req).pipe(map((r) => r.resultado)).subscribe((datosUsuario) => {
        if (datosUsuario[0]){
          console.log(datosUsuario[0]);
          this.datosTablaEstatus(datosUsuario[0]);
          this.tipoEstudio = datosUsuario[0].iIdEstudio;

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
      iIdSolicitud: value.iIdSolicitud,
      dFechaSolicitud: value.dFechaSolicitud,
      iIdCliente: value.iIdCliente,
      iIdEstudio: value.iIdEstudio,
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
    this.router.navigate(['/calidad/estudios-calidad']);
  }

  aprobar() {

    if (this.controlToggleCalidad.value == true) {
      let req = {
        sService: 'aprobarCalidad',
        iIdSolicitud: this.idSolicitud
      }
      this.estudiosService.aprobarCalidad(req).subscribe((resp: any) => {
        console.log(resp);
        if (resp.resultado != 'Ok') {
          this.controlToggleCalidad.patchValue(false);
          return Swal.fire('Error', 'Error al aprobar calidad ' + resp.resultado, 'error')
        };
        this.controlToggleCalidad.disable();
      })
    } else {
      event.preventDefault();
    }

    
  }


}
