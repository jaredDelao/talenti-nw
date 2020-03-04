import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EstudiosService } from '../../../../services/ejecutivo/estudios.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

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

  // Estudios
  columnsEstudios = ["id", "estudios", "documentos", "revision", 'publicar'];
  datosEstudios = [
    { id: 1, estudios: "est1", documentos: "doc1", cancelados: "VALIDADO" },
    { id: 2, estudios: "est2", documentos: "doc2", cancelados: "REAGENDADO" }
  ];

  // Complemento
  columnsComplemento = ["id", "documentos", "revision", 'publicar'];
  datosComplemento = [
    { id: 1, estudios: "est1", documentos: "doc1", cancelados: "VALIDADO" },
    { id: 2, estudios: "est2", documentos: "doc2", cancelados: "REAGENDADO" }
  ];

  datosSolicitud: any = null;
  form: FormGroup;

  constructor(public estudiosService: EstudiosService, private router: Router, private fb: FormBuilder) { }

  ngOnInit() {
    this.formInit();
  this.getDatosId();
  }
  
  getDatosId() {
    this.estudiosService.$detalleSolicitud.subscribe(result => {
      this.datosSolicitud = result;
      console.log(result)
      this.redirect();
      this.setDatos(result)
    })
  }

  redirect() {
    if (this.datosSolicitud == 0 ) {
      return this.router.navigate(['ejecutivo/estudios']);
    }
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
    this.form.setValue({
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
