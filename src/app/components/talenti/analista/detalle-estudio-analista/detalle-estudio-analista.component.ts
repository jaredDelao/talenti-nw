import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
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
import { SolicitarCancelacionEmpleadoComponent } from 'src/app/shared/modals/solicitar-cancelacion-empleado/solicitar-cancelacion-empleado.component';

@Component({
  selector: 'app-detalle-estudio-analista',
  templateUrl: './detalle-estudio-analista.component.html',
  styleUrls: ['./detalle-estudio-analista.component.scss']
})
export class DetalleEstudioAnalistaComponent implements OnInit, OnDestroy, AfterViewInit {

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

  param = {
    sService: "getLstEstudios",
    iIdEmpresa: 0
  }

  // idSolicitud
  idSolicitud: any;

  // catalogos
  catEstudios = [];
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

  // Tabla Estatus
  displayedColumns: string[] = ["proceso", "fecha", "status"];
  dataSource: any
  
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

  controlEstatusDictamen = new FormControl({value: null, disabled: true});
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
  mostrarEstudiosCompletos = false;
  subs1 = new Subscription();

  constructor(public estudiosAnalistaService: EstudiosAnalistaService, private router: Router, private fb: FormBuilder,
              public empresasService: EmpresasService, private estudiosService: EstudiosService ,public dialog: MatDialog, private route: ActivatedRoute) {
                this.catSelectDisctamen = this.catDictamen;
               }

  ngOnInit() {
    this.formInit();
    this.getCatalogoEstudios();
    this.dataSource = this.ELEMENT_DATA;
    this.getDatosId();
    
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

  getCatalogoEstudios() {
    this.subs1 = this.empresasService.getCatalogoEstudios(this.param).subscribe((resp: any) => {
      this.catEstudios = resp.LstEstudios;
    })
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  getDatosId() {
    this.idUrl = this.route.snapshot.paramMap.get('id');
    this.controlEstatusDictamen.setValue(2);

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

        // Tabla estatus
        this.ELEMENT_DATA[0].status = datosUsuario[0].iPublicarPreliminar;
        this.ELEMENT_DATA[1].status = datosUsuario[0].bPublicarDictamen;
        this.ELEMENT_DATA[2].status = datosUsuario[0].iEstatusComplemento;

        this.estudioValid = datosUsuario[0].bValidada;
        this.idSolicitud = datosUsuario[0].iIdSolicitud;
        // Token archivos
        this.tokenPreliminar = datosUsuario[0].sArchivoPreliminar;      
        this.tokenDictamen1 = datosUsuario[0].sArch1Dictamen;      
        this.tokenDictamen2 = datosUsuario[0].sArch2Dictamen;     
        this.tokenComplemento = datosUsuario[0].sTokenComplemento; 
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

    // Desactivar input file ya subidos en estatus 2 - subido ó estatus 3 publicado
    if (value.iPublicarPreliminar == '0' || value.iPublicarPreliminar == '2' || value.iPublicarPreliminar == '3' ) {
      this.controlPreliminar.disable();
    }
    if (value.bPublicarDictamen == '2' || value.bPublicarDictamen == '3') {
      this.controlDictamen.disable();
    }
    if (value.iEstatusComplemento == '2' || value.iEstatusComplemento == '3') {
      this.controlComplemento.disable();
    }

    // estatusDictamen
    this.controlEstatusDictamen.setValue(value.iEstatusDictamen);

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
    console.log(this.tokenComplemento);
    
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

  color(id: 1 | 2 | 3) {

    switch(id) {
      case 1:
        if (this.bPreliminar == '4') return {'background-color': '#FEC6C0'}
        if (this.bPreliminar == '3') return {'background-color': '#D5F5E3'}
        break;

      case 2:
        if (this.bDictamen == '4') return {'background-color': '#FEC6C0'}
        if (this.bDictamen == '3') return {'background-color': '#D5F5E3'}
        break;

      case 3:
        if (this.bComplemento == '4') return {'background-color': '#FEC6C0'}
        if (this.bComplemento == '3') return {'background-color': '#D5F5E3'}
        break;
      
      default:
        return {'background-color': 'transparent'}
        
    }
  }

  solicitarCancelacion(): void {
    const dialogRef = this.dialog.open(SolicitarCancelacionEmpleadoComponent, {
      width: '50vw',
      data: {
        idSolicitud: this.idSolicitud
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      
    });
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