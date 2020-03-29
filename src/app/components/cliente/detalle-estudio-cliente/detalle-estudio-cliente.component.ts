import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { MatDialog } from "@angular/material";
import { CancelarSolicitudClienteComponent } from '../modals/cancelar-solicitud-cliente/cancelar-solicitud-cliente.component';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { EstudiosService } from 'src/app/services/ejecutivo/estudios.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
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
  selector: "app-detalle-estudio-cliente",
  templateUrl: "./detalle-estudio-cliente.component.html",
  styleUrls: ["./detalle-estudio-cliente.component.scss"]
})
export class DetalleEstudioClienteComponent implements OnInit, AfterViewInit, OnDestroy {

  // getEstudios
  param = {
    sService: "getLstEstudios",
    iIdEmpresa: 0
  }

  displayedColumns: string[] = ["proceso", "fecha", "status"];
  dataSource = ELEMENT_DATA;

  columnsPreliminar = ["estudios", "documentos"];
  datosPreliminar = [
    { estudios: "est1", documentos: "doc1" },
    { estudios: "est2", documentos: "doc2" }
  ];

  // Estudios
  columnsEstudios = ["estudios", "documentos"];
  datosEstudios = [
    {token: null, token2: null},
  ];

  // Complemento
  columnsComplemento = ["estudios"];
  datosComplemento = [
    {token: null},
  ];

  loading: boolean = false;
  form: FormGroup;
  bDictamen: any;
  bComplemento: any;
  catEstudios: any;
  idSolicitud: any;
  datosSolicitud: any;
  estudioValid: any = '';
  idEstudio: any;
  mostrarEstudiosCompletos: boolean = false;
  solicitudEnProceso: boolean = false;

  subs = new Subscription();
  subs1 = new Subscription();
  subs2 = new Subscription();

  constructor(public dialog: MatDialog, private fb: FormBuilder, public estudiosService: EstudiosService, private route: ActivatedRoute, 
              private router: Router, public empresasService: EmpresasService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.formInit();
    this.getUrlId();
    this.getCatalogoEstudios();
  }

  ngAfterViewInit() {
      let value = this.idEstudio;
      if (value == 1 || value == 3 || value == 4 || value == 5 || value == 7|| 
          value == 10 || value == 11 || value == 12) {
            this.mostrarEstudiosCompletos = true;
      }
      else { this.mostrarEstudiosCompletos = false; }
    // this.verificarMessage();
    this.cd.detectChanges();
  }
    
  // Mostrar message
  verificarMessage(bDictamen) {
      if (bDictamen != '3' ) this.solicitudEnProceso = true;
  }

  ngOnDestroy() {
    this.subs.unsubscribe()
    this.subs1.unsubscribe()
    this.subs2.unsubscribe()
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
        this.verificarMessage(datosUsuario[0].bPublicarDictamen);
        this.bComplemento = datosUsuario[0].iEstatusComplemento;
        // this.bPreliminar = datosUsuario[0].iPublicarPreliminar;
        this.datosSolicitud = datosUsuario[0];
        this.idEstudio = datosUsuario[0].iIdEstudio;
        this.estudioValid = datosUsuario[0].bValidada;
        this.setDatosEstudioDictamen(datosUsuario[0]);
        this.setDatosComplemento(datosUsuario[0]);
        this.setDatos(this.datosSolicitud);

        this.loading = false;
      }, (err) => this.loading = false, (() => this.loading = false));
    } else  {
      this.loading = false;
      return this.router.navigate(['/cliente/estudios-cliente']);
    }
  }

  setDatosEstudioDictamen(value) {
    this.datosEstudios[0].token = value.sArch1Dictamen;
    this.datosEstudios[0].token2 = value.sArch2Dictamen;
  }
  setDatosComplemento(value) {
    this.datosComplemento[0].token = value.sTokenComplemento;
  }

  getCatalogoEstudios() {
    this.subs1 = this.empresasService.getCatalogoEstudios(this.param).subscribe((resp: any) => {
      this.catEstudios = resp.LstEstudios;
    })
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CancelarSolicitudClienteComponent, {
      width: "60%",
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  formInit() {
    this.form = this.fb.group({
      sService: new FormControl('SolicitarEstudio'),
      iIdCliente: new FormControl('1'),
      iIdEstudio: new FormControl('', [Validators.required]),
      sFolio: new FormControl(''),
      analista: new FormControl(''),
      iPreliminar: new FormControl(),
      sComentarios: new FormControl('', [Validators.required]),
      iIdAnalista: new FormControl('1'),
      sTokenCV: new FormControl(''),
      sNombres: new FormControl('', [Validators.required]),
      sApellidos: new FormControl('', [Validators.required]),
      sPuesto: new FormControl('', [Validators.required]),
      sTelefono: new FormControl('', [Validators.required]),
      sNss: new FormControl('', [Validators.required]),
      sCurp: new FormControl('', [Validators.required]),
      sCalleNumero: new FormControl('', [Validators.required]),
      sColonia: new FormControl('', [Validators.required]),
      sCp: new FormControl('', [Validators.required]),
      sMunicipio: new FormControl('', [Validators.required]),
      sEstado: new FormControl('', [Validators.required])
    });
  }

  setDatos(value) {
    this.form.disable();

    this.form.patchValue({
      iIdSolicitud: value.iIdSolicitud,
      dFechaSolicitud: value.dFechaSolicitud,
      iIdCliente: value.iIdCliente,
      iIdEstudio: value.iIdEstudio,
      sFolio: value.sFolio,
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
