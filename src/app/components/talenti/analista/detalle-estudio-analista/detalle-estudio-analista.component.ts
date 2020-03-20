import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EstudiosAnalistaService } from 'src/app/services/analista/estudios-analista.service';
import { EmpresasService } from 'src/app/services/coordinador/empresas.service';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material';
import { SubirPreliminarModalComponent } from '../modals/subir-preliminar-modal/subir-preliminar-modal.component';
import { SubirDictamenModalComponent } from '../modals/subir-dictamen-modal/subir-dictamen-modal.component';
import { EstudiosService } from 'src/app/services/ejecutivo/estudios.service';
import { pipe, Subscription } from 'rxjs';
import { map, filter } from 'rxjs/operators';

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
export class DetalleEstudioAnalistaComponent implements OnInit, OnDestroy {

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

  idUrl: any;
  subs = new Subscription();

  bPreliminar: any;
  bDictamen: any;
  bComplemento: any;

  constructor(public estudiosAnalistaService: EstudiosAnalistaService, private router: Router, private fb: FormBuilder,
              public empresasService: EmpresasService, private estudiosService: EstudiosService ,public dialog: MatDialog, private route: ActivatedRoute) { }

  ngOnInit() {
    this.formInit();
    this.getDatosId();

    
  }

  mostrarColumnasConMotivo() {
    if (this.bDictamen == 4) {
      this.displayedColumnsDictamen.push('motivo');
    } else {
      this.displayedColumnsDictamen = ['tipo', 'descargar'];
    }
    if (this.bComplemento == 4) {
      this.displayedColumnsComplemento.push('motivo');
    } else {
      this.displayedColumnsComplemento = ['tipo', 'descargar'];
    }
    if (this.bPreliminar == 4) {
      this.displayedColumnsPreliminar.push('motivo');
    } else {
      this.displayedColumnsPreliminar = ['tipo', 'descargar'];
    }

  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  getDatosId() {
    this.idUrl = this.route.snapshot.paramMap.get('id');
    if (this.idUrl) {

      let req = {
        sService: 'getSolicitudById',
        IdSolicitud: this.idUrl,
      }
      this.subs =  this.estudiosService.getEstudioById(req).pipe(
        filter((r) => r.resultado != undefined ),
        map((r) => r.resultado))
        .subscribe(datosUsuario => {
        this.datosSolicitud = datosUsuario[0];
        this.bDictamen = datosUsuario[0].bPublicarDictamen;
        this.bComplemento = datosUsuario[0].iEstatusComplemento;
        this.bPreliminar = datosUsuario[0].iPublicarPreliminar;
        console.log(datosUsuario[0]);
        this.estudioValid = datosUsuario[0].bValidada;
        this.idSolicitud = datosUsuario[0].iIdSolicitud;
        // Token archivos
        this.tokenPreliminar = datosUsuario[0].sArchivoPreliminar;      
        this.tokenDictamen1 = datosUsuario[0].sArch1Dictamen;      
        this.tokenDictamen2 = datosUsuario[0].sArch2Dictamen;      
        this.setDatos(this.datosSolicitud);
        this.mostrarColumnasConMotivo();
      })
    } else {
      return this.router.navigate(['analista/estudios']);
    }
  }

  formInit() {
    this.form = this.fb.group({
      iIdSolicitud: new FormControl({value: '', disabled: true}),
      dFechaSolicitud: new FormControl({value: '', disabled: true}),
      iIdCliente: new FormControl({value: '', disabled: true}),
      iIdEstudio: new FormControl({value: '', disabled: true}),
      sFolio: new FormControl({value: '', disabled: true}),
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

    // Validar input file preliminar | dictamen
    if (value.iPublicarPreliminar == '0' || value.iPublicarPreliminar == '2' || value.iPublicarPreliminar == '3' ) {
      this.controlPreliminar.disable();
    }
    if (value.bPublicarDictamen == '2' || value.bPublicarDictamen == '3') {
      this.controlDictamen.disable();
    }

    this.form.setValue({
      iIdSolicitud: value.iIdSolicitud,
      dFechaSolicitud: value.dFechaSolicitud,
      iIdCliente: value.iIdCliente,
      iIdEstudio: value.iIdEstudio,
      sFolio: value.sFolio,
      // iPublicarPreliminar: value.iPublicarPreliminar,
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

  openDialogPreliminarComplemento(token, id): void {
    const dialogRef = this.dialog.open(SubirPreliminarModalComponent, {
      width: '400px',
      data: {token, idSolicitud: this.idSolicitud, id}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.controlComplemento.reset();
      this.getDatosId();
    });
  }
  openDialogDictamen(): void {
    const dialogRef = this.dialog.open(SubirDictamenModalComponent, {
      width: '400px',
      data: {idSolicitud: this.idSolicitud}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.controlDictamen.reset();
      this.getDatosId();
    });
  }

  // SUBIR ARCHIVO Y CAMBIAR COMPLEMENTO O PRELIMINAR
  subirArchivo(e, id: 'subirPreliminar' | 'subirComplemento') {

    let blob = e.target.files[0];
    let name = e.target.files[0].name;

    this.loader = true;
    this.empresasService.subirArchivo(blob, name).subscribe((resp: any ) => { 

      if (!resp.Identificador || resp.resultado != 'Ok') {
        this.loader = false;
        // this.reqArchivo.ArchivoPreliminar = null;
        this.controlPreliminar.setValue(null)
        return Swal.fire('Error al cargar archivo', 'Revisa que sea un formato DOCX o PDF', 'error');
      }
      this.loader = false;
      this.openDialogPreliminarComplemento(resp.Identificador, id);
      
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