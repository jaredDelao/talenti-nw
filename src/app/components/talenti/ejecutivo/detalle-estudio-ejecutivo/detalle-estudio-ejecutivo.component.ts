import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EstudiosService } from '../../../../services/ejecutivo/estudios.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { EmpresasService } from 'src/app/services/coordinador/empresas.service';
import { Route } from '@angular/compiler/src/core';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-detalle-estudio-ejecutivo',
  templateUrl: './detalle-estudio-ejecutivo.component.html',
  styleUrls: ['./detalle-estudio-ejecutivo.component.scss']
})
export class DetalleEstudioEjecutivoComponent implements OnInit, OnDestroy {
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

  // Complemento
  columnsComplemento = ["estudios", "revision", 'publicar'];
  datosComplemento = [
    {token: null},
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

  subs = new Subscription();
  subs1 = new Subscription();
  subs2 = new Subscription();

  constructor(public estudiosService: EstudiosService, public empresasService: EmpresasService, private router: Router, private fb: FormBuilder, 
              private cd: ChangeDetectorRef, private route: ActivatedRoute) {
               }

  ngOnInit() {
    this.formInit();
    this.getUrlId();
    this.dataSource = this.ELEMENT_DATA;
    
    // this.getDatosId();
    this.getCatalogoEstudios();
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
        console.log(datosUsuario[0]);
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
}
