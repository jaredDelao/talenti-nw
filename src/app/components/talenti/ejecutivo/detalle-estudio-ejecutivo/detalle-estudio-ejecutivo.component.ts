import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { EstudiosService } from '../../../../services/ejecutivo/estudios.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { EmpresasService } from 'src/app/services/coordinador/empresas.service';

const ELEMENT_DATA = [
  {
    proceso: "Solicitud",
    fecha: "11/10/2019",
    hora: 1.0079,
    status: "VALIDADO"
  },
  {
    proceso: "Agenda",
    fecha: "30/11/2019",
    hora: 4.0026,
    status: "REAGENDADO"
  },
  {
    proceso: "Aplicación",
    fecha: "25/12/2019",
    hora: 6.941,
    status: "EXITOSO"
  },
  // { proceso: "Global", fecha: "1/01/2020", hora: 9.0122, status: "PUBLICADO" }
];

@Component({
  selector: 'app-detalle-estudio-ejecutivo',
  templateUrl: './detalle-estudio-ejecutivo.component.html',
  styleUrls: ['./detalle-estudio-ejecutivo.component.scss']
})
export class DetalleEstudioEjecutivoComponent implements OnInit {

  displayedColumns: string[] = ["proceso", "fecha", "status"];
  dataSource = ELEMENT_DATA;

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

  datosSolicitud: any = null;
  form: FormGroup;
  estudioValid: any = '';
  catEstudios: any;
  idSolicitud: any;

  constructor(public estudiosService: EstudiosService, public empresasService: EmpresasService, private router: Router, private fb: FormBuilder, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.formInit();
    this.getDatosId();
    this.getCatalogoEstudios();
  }

  getCatalogoEstudios() {
    this.empresasService.getCatalogoEstudios().subscribe((resp: any) => {
      this.catEstudios = resp.LstEstudios;
    })
  }
  
  getDatosId() {
    this.estudiosService.$detalleSolicitud.subscribe(datosUsuario => {
      this.idSolicitud = datosUsuario.iIdSolicitud;
      this.datosSolicitud = datosUsuario;
      this.estudioValid = datosUsuario.bValidada;
      console.log(datosUsuario)
      this.redirect();
      this.setDatosPreliminar(datosUsuario);
      this.setDatosEstudioDictamen(datosUsuario);
      this.setDatosComplemento(datosUsuario);
      // this.setDatos(result)
    })
  }

  setDatosPreliminar(value) {
    // this.datosPreliminar[0].bPreliminar = value.bPreliminar;
    this.datosPreliminar[0].token = value.sArchivoPreliminar;
  }
  setDatosEstudioDictamen(value) {
    // this.datosEstudios[0].bPreliminar = value.bPreliminar;
    this.datosEstudios[0].token = value.sArch1Dictamen;
    this.datosEstudios[0].token2 = value.sArch2Dictamen;
  }
  setDatosComplemento(value) {
    // this.datosComplemento[0].bPreliminar = value.bPreliminar;
    this.datosComplemento[0].token = value.sArchComplemento;
  }

  redirect() {
    if (this.datosSolicitud == 0 ) {
      return this.router.navigate(['ejecutivo/estudios']);
    }
    this.setDatos(this.datosSolicitud);
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
}
