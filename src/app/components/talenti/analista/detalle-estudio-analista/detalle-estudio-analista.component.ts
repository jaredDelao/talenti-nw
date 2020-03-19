import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { EstudiosAnalistaService } from 'src/app/services/analista/estudios-analista.service';
import { EmpresasService } from 'src/app/services/coordinador/empresas.service';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material';
import { SubirPreliminarModalComponent } from '../modals/subir-preliminar-modal/subir-preliminar-modal.component';
import { SubirDictamenModalComponent } from '../modals/subir-dictamen-modal/subir-dictamen-modal.component';

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
  selector: 'app-detalle-estudio-analista',
  templateUrl: './detalle-estudio-analista.component.html',
  styleUrls: ['./detalle-estudio-analista.component.scss']
})
export class DetalleEstudioAnalistaComponent implements OnInit {

  idSolicitud: any;

  // Tabla Estatus
  displayedColumns: string[] = ["proceso", "fecha", "status"];
  dataSource = ELEMENT_DATA;
  
  // Tabla preliminar
  displayedColumnsPreliminar: string[] = ["tipo", "descargar"];
  dataSourcePreliminar: any[] = [ {name: 'Archivo'} ];
  // Tabla dictamen
  displayedColumnsDictamen: string[] = ["tipo", "descargar"];
  dataSourceDictamen: any[] = [ {name: 'Archivos'} ];
  // Tabla Complemento
  displayedColumnsComplemento: string[] = ["tipo", "descargar"];
  dataSourceComplemento: any[] = [ {name: 'Archivo'} ];
  
  // Datos solicitud por subject
  datosSolicitud: any = null;
  form: FormGroup;
  //&
  estudioValid: any = '';
  loader: boolean = false;
  public reqArchivo = {
    sService: 'subirArchivo',
    ArchivoPreliminar: '',
    p: '()_A81523[]'
  }

  controlPreliminar = new FormControl({value: '', disabled: false});
  controlDictamen = new FormControl('');
  controlComplemento = new FormControl('');

  tokenPreliminar: boolean = false;
  tokenDictamen1: boolean = false;
  tokenDictamen2: boolean = false;
  tokenComplemento: boolean = false;
  

  constructor(public estudiosAnalistaService: EstudiosAnalistaService, private router: Router, private fb: FormBuilder,
              public empresasService: EmpresasService, public dialog: MatDialog) { }

  ngOnInit() {
    this.formInit();
    this.getDatosId();
  }
  
  getDatosId() {
    this.estudiosAnalistaService.$detalleSolicitud.subscribe(datosUsuario => {
      this.datosSolicitud = datosUsuario;
      this.estudioValid = datosUsuario.bValidada;
      this.idSolicitud = datosUsuario.iIdSolicitud;
      // Token archivos
      this.tokenPreliminar = datosUsuario.sArchivoPreliminar;      
      this.tokenDictamen1 = datosUsuario.sArch1Dictamen;      
      this.tokenDictamen2 = datosUsuario.sArch2Dictamen;      
      console.log(datosUsuario)
      this.redirect();
      // this.setDatos(result)
    })
  }

  redirect() {
    if (this.datosSolicitud == 0 ) {
      return this.router.navigate(['/analista/estudios']);
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

    if (value.bPreliminar !== '1' || value.sArchivoPreliminar != null) {
      this.controlPreliminar.disable()
    }
    if (this.tokenDictamen1 && this.tokenDictamen2) {
      this.controlDictamen.disable();
    }

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

  openDialogPreliminar(token, id): void {
    const dialogRef = this.dialog.open(SubirPreliminarModalComponent, {
      width: '400px',
      data: {token, idSolicitud: this.idSolicitud, id}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  openDialogDictamen(): void {
    const dialogRef = this.dialog.open(SubirDictamenModalComponent, {
      width: '400px',
      data: {idSolicitud: this.idSolicitud}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  subirArchivo(e, id: 'subirPreliminar' | 'subirComplemento') {

    let blob = e.target.files[0];
    let name = e.target.files[0].name;

    console.log(e);

    this.loader = true;
    this.empresasService.subirArchivo(blob, name).subscribe((resp: any ) => { 

      if (!resp.Identificador || resp.resultado != 'Ok') {
        this.loader = false;
        // this.reqArchivo.ArchivoPreliminar = null;
        this.controlPreliminar.setValue(null)
        return Swal.fire('Error al cargar archivo', 'Revisa que sea un formato DOCX o PDF', 'error');
      }
      this.loader = false;
      this.openDialogPreliminar(resp.Identificador, id);
      
    }, (err) => {
      this.loader = false;
      return Swal.fire('Error al cargar archivo', 'Revisa que sea un formato DOCX o PDF', 'error');
    }), () => {
      this.loader = false;
    }
    
  }

  subirArchivosDictamen() {
    this.openDialogDictamen();
  }

  // DESCARGA ARCHIVOS
  descargarPreliminar() {
    let req = {
      token: this.tokenPreliminar,
    }
    this.estudiosAnalistaService.descargarPreliminar(req).subscribe((res) => {
      console.log(res); 
    })
  }
  descargarComplemento() {
    let req = {
      token: this.tokenComplemento,
    }
    this.estudiosAnalistaService.descargarPreliminar(req).subscribe((res) => {
      console.log(res); 
    })
  }
  descargarDictamen(param) {
    let req: any = { token: ''};

    if (param == 1) {
      req.token = this.tokenDictamen1;
    } else {
      req.token = this.tokenDictamen2;
    }
    this.estudiosAnalistaService.descargarPreliminar(req).subscribe((res) => {
      console.log(res); 
    })
  }
    
}