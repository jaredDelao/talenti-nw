import { Component, OnInit, ChangeDetectorRef, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EstudiosService } from '../../../../services/ejecutivo/estudios.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { EmpresasService } from 'src/app/services/coordinador/empresas.service';
import { Route } from '@angular/compiler/src/core';
import { map, pluck, flatMap, filter, toArray, catchError } from 'rxjs/operators';
import { Subscription, of } from 'rxjs';
import { EmpleadosService } from 'src/app/services/coordinador/empleados.service';
import { MatDialog } from '@angular/material';
import { SolicitarCancelacionEjecutivoComponent } from '../modals/solicitar-cancelacion-ejecutivo/solicitar-cancelacion-ejecutivo.component';

@Component({
  selector: 'app-detalle-estudio-ejecutivo',
  templateUrl: './detalle-estudio-ejecutivo.component.html',
  styleUrls: ['./detalle-estudio-ejecutivo.component.scss']
})
export class DetalleEstudioEjecutivoComponent implements OnInit, OnDestroy, AfterViewInit {
  ELEMENT_DATA = [
    {
      id: 1,
      proceso: "Preliminar",
      fecha: "11/10/2019",
      status: ""
    },
    {
      id: 2,
      proceso: "Dictamen",
      fecha: "30/11/2019",
      status: ""
    },
    {
      id: 3,
      proceso: "Complemento",
      fecha: "25/12/2019",
      status: ""
    },
  ];

  loading: boolean = false;

  param = {
    sService: "getLstEstudios",
    iIdEmpresa: 0
  }

  displayedColumns: string[] = ["proceso", "fecha", "status"];
  dataSource;

  // Preliminar
  columnsPreliminar = ["estudios", "revision", 'publicar'];
  datosPreliminar = [
    {token: null},
  ];

  // Estudios
  columnsEstudios = ["estudios", "documentos", "revision", 'publicar'];
  datosEstudios = [
    {token: null, token2: null},
  ];

  // Bandera cancelacion
  bSolicCancel: any = null;


  // Complemento
  columnsComplemento = ["estudios", "revision", 'publicar'];
  datosComplemento = [
    {token: null},
  ];

  catAnalistas = [];
  catSelectDisctamen: any[];
  catDictamen = [
    {id: '1', name: 'EN PROCESO'},
    {id: '2', name: 'RECOMENDADO'},
    {id: '3', name: 'NO RECOMENDADO'},
    {id: '4', name: 'RECOMENDADO CON RESERVA'},
  ];
  catDictamenGNP = [
    {id: '10', name: 'EN PROCESO'},
    {id: '11', name: 'RIESGO 1'},
    {id: '12', name: 'RIESGO 2'},
    {id: '13', name: 'RIESGO 3'},
    {id: '14', name: 'SIN RIESGO'},
  ];

  datosSolicitud: any;
  form: FormGroup;
  estudioValid: any = '';
  catEstudios: any;
  idSolicitud: any;

  // Estatus @input
  bDictamen: any;
  bPreliminar: any;
  bComplemento: any;
  estatusGeneral: any;

   // Tabla estatus
  dataTablaEstatus: any[] = [];
  columnasTablaEstatus: any[]= ['estatus_solicitud', 'estatus_asignacion', 'estatus_agenda', 'estatus_aplicacion', 'estatus_dictamen', 'estatus_preliminar','dictamen'];
  tipoEstudio: any = null;

  subs = new Subscription();
  subs1 = new Subscription();
  subs2 = new Subscription();

  controlEstatusDictamen = new FormControl({value: null, disabled: true});


  mostrarEstudiosCompletos: boolean = false;

  constructor(public estudiosService: EstudiosService, public empresasService: EmpresasService, private router: Router, private fb: FormBuilder, public dialog: MatDialog,
              private cd: ChangeDetectorRef, private route: ActivatedRoute, private empleadosService: EmpleadosService) {
                this.catSelectDisctamen = this.catDictamen;
               }

  ngOnInit() {
    this.formInit();
    this.getCatAnalistas();
    this.getUrlId();
    this.dataSource = this.ELEMENT_DATA;
    
    // this.getDatosId();
    this.getCatalogoEstudios();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
    this.subs1.unsubscribe();
  }

  ngAfterViewInit() {
    this.form.get('iIdEstudio').valueChanges.subscribe(value => {
      if (value == 1 || value == 3 || value == 4 || value == 5 || value == 7|| 
          value == 10 || value == 11 || value == 12) {
            this.mostrarEstudiosCompletos = true;
          }
          else {
            this.mostrarEstudiosCompletos = false;
          }
    })
  }

  getCatAnalistas() {
    this.subs =  this.empleadosService.getEmpleados().pipe(
       pluck('Empleados'),
       flatMap((r: any) => r),
       filter((val: any) => val.iIdRol == 3),
       toArray(),
       catchError((err) => of([])))
     .subscribe((analistas: Array<any>) => {
       this.catAnalistas = analistas;
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
        console.log(datosUsuario[0]);
        this.datosTablaEstatus(datosUsuario[0]);
        this.bSolicCancel = datosUsuario[0].CancelSolic;
        this.estatusGeneral = datosUsuario[0].iEstatusGeneral;
        this.tipoEstudio = datosUsuario[0].iIdEstudio;
        this.idSolicitud = datosUsuario[0].iIdSolicitud;
        this.bDictamen = datosUsuario[0].bPublicarDictamen;
        this.bComplemento = datosUsuario[0].iEstatusComplemento;
        this.bPreliminar = datosUsuario[0].iPublicarPreliminar;
        this.datosSolicitud = datosUsuario[0];
        this.estudioValid = datosUsuario[0].bValidada;
        this.setDatosPreliminar(datosUsuario[0]);
        this.setDatosEstudioDictamen(datosUsuario[0]);
        this.setDatosComplemento(datosUsuario[0]);
        this.setDatos(this.datosSolicitud);

        // Tabla estatus
        this.ELEMENT_DATA[0].status = datosUsuario[0].iPublicarPreliminar;
        this.ELEMENT_DATA[1].status = datosUsuario[0].bPublicarDictamen;
        this.ELEMENT_DATA[2].status = datosUsuario[0].iEstatusComplemento;
        
        this.loading = false;
      }, (err) => this.loading = false, (() => this.loading = false));
    } else  {
      this.loading = false;
      return this.router.navigate(['ejecutivo/estudios']);
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

  // PARAMETROS POR PASAR EN INPUT
  setDatosPreliminar(value) {
    this.datosPreliminar[0].token = value.sArchivoPreliminar;
  }
  setDatosEstudioDictamen(value) {
    this.datosEstudios[0].token = value.sArch1Dictamen;
    this.datosEstudios[0].token2 = value.sArch2Dictamen;
  }
  setDatosComplemento(value) {
    this.datosComplemento[0].token = value.sTokenComplemento;
  }

  formInit() {
    this.form = this.fb.group({
      iIdSolicitud: new FormControl({value: '', disabled: true}),
      dFechaSolicitud: new FormControl({value: '', disabled: true}),
      iIdCliente: new FormControl({value: '', disabled: true}),
      iIdEstudio: new FormControl({value: '', disabled: true}),
      sFolio: new FormControl({value: '', disabled: true}),
      bPreliminar: new FormControl({value: '', disabled: true}),
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
    // estatusDictamen
    this.controlEstatusDictamen.setValue(value.iEstatusDictamen);
    
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
      iPublicarPreliminar: value.iPublicarPreliminar
    })
  }

  update($event) {
    this.getUrlId();
  }

  checkEstatus(estatus, id) {
    
    if (id == 1) {
      if (estatus == 0) return 'No aplica';
      if (estatus == 1) return 'En proceso';
      if (estatus == 2) return 'Subido';
      if (estatus == 3) return 'Publicado';
      if (estatus == 4) return 'En revisión';
      return 'No aplica';

    } else {
      if (estatus == 0) return 'En proceso';
      if (estatus == 1) return 'En proceso';
      if (estatus == 2) return 'Subido';
      if (estatus == 3) return 'Publicado';
      if (estatus == 4) return 'En revisión';
      return 'No aplica';
    }
  }

  solicitarCancelacionEjecutivo() {
    const dialogRef = this.dialog.open(SolicitarCancelacionEjecutivoComponent, {
      width: '60%',
      data: {idSolicitud: this.idSolicitud}
    });

    dialogRef.afterClosed().subscribe(result => {
      
    });
  }
}
