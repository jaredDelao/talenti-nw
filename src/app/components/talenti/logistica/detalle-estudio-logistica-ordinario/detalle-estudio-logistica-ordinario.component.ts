import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { EstudiosService } from 'src/app/services/ejecutivo/estudios.service';
import * as moment from 'moment';
import { EmpresasService } from 'src/app/services/coordinador/empresas.service';
import Swal from 'sweetalert2';
import { LogisticaService } from 'src/app/services/logistica/logistica.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { CancelarSolicitudComponent } from '../cancelar-solicitud/cancelar-solicitud.component';
import { SolicitarCancelacionEmpleadoComponent } from 'src/app/shared/modals/solicitar-cancelacion-empleado/solicitar-cancelacion-empleado.component';

@Component({
  selector: 'app-detalle-estudio-logistica-ordinario',
  templateUrl: './detalle-estudio-logistica-ordinario.component.html',
  styleUrls: ['./detalle-estudio-logistica-ordinario.component.scss']
})
export class DetalleEstudioLogisticaOrdinarioComponent implements OnInit {

  preliminarList = [
    {nombre: 'SI', value: '1'},
    {nombre: 'NO', value: '0'},
  ];
  form: FormGroup;
  formAgenda: FormGroup;
  mostrarEstudiosCompletos: boolean = false;
  loading: boolean = false;
  idSolicitud: any;
  idCliente: any;
  datosSolicitud: any;
  alertCancelado: any;
  mostrarBtnAgendar: any;

  // Catalogos
  catEstudios: any = [];
  param = {
    sService: "getLstEstudios",
    iIdEmpresa: 0
  }

  estudiosData = [];
  esGNP: boolean = false;
  esCliente: boolean = false;
  contadorAgendas: any;
  textMensaje: any = null;

  subs = new Subscription();
  subs1 = new Subscription();
  subs2 = new Subscription();

  // Fecha hora
  fecha = new FormControl(null, Validators.required);
  hora = new FormControl(null, Validators.required);
  sNombreEncuestador = new FormControl(null, Validators.required);
  sCorreoEncuestador = new FormControl(null, [Validators.required, Validators.email]);
  sTelefonoEncuestador = new FormControl(null, [Validators.required]);
  sComentariosAgenda = new FormControl(null, Validators.required);
  pagosVisita = new FormControl(null, Validators.required);
  viaticosVisita = new FormControl(null, Validators.required);
  ligaArchivo = new FormControl(null, Validators.required);
  controlAplicado = new FormControl(false);

  // Tabla estatus
  dataTablaEstatus: any[] = [];
  columnasTablaEstatus: any[] = ['estatus_agenda', 'estatus_aplicacion'];
  tipoEstudio: any = null;

  constructor(private fb: FormBuilder, private atp: AmazingTimePickerService, public empresasService: EmpresasService, public logisticaService: LogisticaService, private _snackBar: MatSnackBar,
              private route: ActivatedRoute, private estudiosService: EstudiosService, private router: Router, public dialog: MatDialog) { }

  ngOnInit() {
    this.formInit();
    this.getUrlId();
    this.getCatalogoEstudios();
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
          this.datosTablaEstatus(datosUsuario[0]);
          this.tipoEstudio = datosUsuario[0].iIdEstudio;

          // checkAplicado
          if (datosUsuario[0].bEstatusAsignacion == '1'){
            this.controlAplicado.setValue(true);
            this.controlAplicado.disable();
          }

          this.idCliente = datosUsuario[0].iIdCliente;
          this.idSolicitud = datosUsuario[0].iIdSolicitud;
          this.datosSolicitud = datosUsuario[0];
          this.contadorAgendas = datosUsuario[0].iContadoAgendas;
          this.mostrarBtnAgenda(datosUsuario[0].iContadoAgendas);
  
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

  mostrarBtnAgenda(contador: string) {

    if (contador == '1') this.textMensaje = 'AGENDADO'
    if (contador == '2') this.textMensaje = 'REAGENDADO'

    let cont = parseInt(contador);
    if (cont >= 0 && cont <= 2) {
      return this.mostrarBtnAgendar = true
    } else {
      return this.mostrarBtnAgendar = false;
    }
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

    if (value.iContadoAgendas > '0') {
      this.setDatosAgenda(value);
      this.insertarFecha(value.dFechaHoraAgenda);
    }

    if (value.iContadoAgendas >= '3') {
      this.sNombreEncuestador.disable();
      this.sCorreoEncuestador.disable();
      this.sTelefonoEncuestador.disable();
      this.sComentariosAgenda.disable();
      this.fecha.disable();
      this.hora.disable();
    }
  }

  setDatosAgenda(value) {
    this.sNombreEncuestador.patchValue(value.sNombreEncuestador);
    this.sCorreoEncuestador.patchValue(value.sCorreoEncuestador);
    this.sTelefonoEncuestador.patchValue(value.sTelefonoEncuestador);
    this.sComentariosAgenda.patchValue(value.sComentariosAgenda);
    this.viaticosVisita.patchValue(value.viaticosVisita);
    this.pagosVisita.patchValue(value.pagosVisita);
    this.ligaArchivo.patchValue(value.ligaArchivo);
  }

  insertarFecha(fechaHora) {
    let fecha = moment(fechaHora).toDate();
    this.fecha.patchValue(fecha);
    let hora = moment(fechaHora).format('HH:mm');
    this.hora.setValue(hora);
  }

  openClock() {
    this.atp.open();
  }

  regresarFunc() {
    this.router.navigate(['/logistica/estudios-logistica']);
  }

  get unirFechaHora() {
    let fecha = moment(this.fecha.value).format('YYYY-MM-DD');
    let hora = this.hora.value;
    let resp = fecha + ' ' + hora;
    
    return resp;
  }

  agendar() {
    this.loading = true;

    if (this.fecha.valid && this.hora.valid && this.sNombreEncuestador.valid && this.sCorreoEncuestador.valid &&  this.sTelefonoEncuestador.valid && 
        this.sComentariosAgenda.valid && this.viaticosVisita.valid && this.pagosVisita.valid && this.ligaArchivo.valid) {
      let req = {
        sService: 'nuevaAgenda',
        iIdSolicitud: this.idSolicitud,
        sNombreEncuestador: this.sNombreEncuestador.value,
        sCorreo: this.sCorreoEncuestador.value,
        sTelefono: this.sTelefonoEncuestador.value,
        sComentarios: this.sComentariosAgenda.value,
        dFechaHora: this.unirFechaHora,
        sPagosVisita: this.pagosVisita.value,
        sViaticosVisita: this.viaticosVisita.value,
        ligaArchivo: this.ligaArchivo.value
      }      

      this.logisticaService.agendar(req).subscribe((resp: any) => {        
        if (resp.resultado != 'Ok') {
          this.loading = false;
          return Swal.fire('Error', 'Error al agendar solicitud', 'error');
        }

        this.loading = false;
        return Swal.fire('Agenda exitosa', 'El estudio se ha agendado exitosamente', 'success').then(() => {
        location.reload();
        })
      });
     } else {
       this.loading = false;
      return Swal.fire('Alerta', 'Faltan campos por llenar', 'warning')
    }
  }

  solicitarCancelacion() {
    const dialogRef = this.dialog.open(SolicitarCancelacionEmpleadoComponent, {
      width: '45vw',
      // height: '70vh',
      maxWidth: '85vw',
      maxHeight: '90vh',
      data: {idSolicitud: this.idSolicitud}
    });

  }

  verificarAplicado() {
    let checked = this.controlAplicado.value;

    if (checked) {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success ml-3',
          cancelButton: 'btn btn-danger mr-3'
        },
        buttonsStyling: false
      })
      
      swalWithBootstrapButtons.fire({
        title: 'AVISO',
        text: "¿Seguro que deseas marcarlo como aplicado?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
      }).then((result) => {
        if (result.value) {
          let req = {
            sService: 'AprobarAsignacion',
            iIdSolicitud: this.idSolicitud
          }
          this.logisticaService.AprobarAsignacion(req).subscribe((resp: any) => {
            if (resp.resultado != 'Ok') {
              this.controlAplicado.setValue(false);
              return Swal.fire('Error', 'Hubo un error al marcar la solicitud como aplicado'+ resp.resultado, 'error')
            }

            this._snackBar.open('El estudio ha sido marcado como aplicado exitosamente', 'cerrar', {
              duration: 4000,
            });

            this.controlAplicado.disable();
          })
         
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          return this.controlAplicado.setValue(false);
        }
      })
    }
    
  }
}



