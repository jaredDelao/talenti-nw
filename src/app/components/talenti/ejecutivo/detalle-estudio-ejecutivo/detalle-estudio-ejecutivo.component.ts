import {
  Component,
  OnInit,
  ChangeDetectorRef,
  OnDestroy,
  AfterViewInit,
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { EstudiosService } from "../../../../services/ejecutivo/estudios.service";
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { EmpresasService } from "src/app/services/coordinador/empresas.service";
import { Route } from "@angular/compiler/src/core";
import {
  map,
  pluck,
  flatMap,
  filter,
  toArray,
  catchError,
  takeUntil,
} from "rxjs/operators";
import { Subscription, of, Subject } from "rxjs";
import { EmpleadosService } from "src/app/services/coordinador/empleados.service";
import { MatDialog } from "@angular/material";
import { SolicitarCancelacionEjecutivoComponent } from "../modals/solicitar-cancelacion-ejecutivo/solicitar-cancelacion-ejecutivo.component";
import { EstudiosAnalistaService } from "src/app/services/analista/estudios-analista.service";
import { AprobarCancelacionModalComponent } from "../modals/aprobar-cancelacion-modal/aprobar-cancelacion-modal.component";
import Swal from "sweetalert2";

@Component({
  selector: "app-detalle-estudio-ejecutivo",
  templateUrl: "./detalle-estudio-ejecutivo.component.html",
  styleUrls: ["./detalle-estudio-ejecutivo.component.scss"],
})
export class DetalleEstudioEjecutivoComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  ELEMENT_DATA = [
    {
      id: 1,
      proceso: "Preliminar",
      fecha: "11/10/2019",
      status: "",
    },
    {
      id: 2,
      proceso: "Dictamen",
      fecha: "30/11/2019",
      status: "",
    },
    {
      id: 3,
      proceso: "Complemento",
      fecha: "25/12/2019",
      status: "",
    },
  ];

  loading: boolean = false;

  param = {
    sService: "getLstEstudios",
    iIdEmpresa: 0,
  };

  displayedColumns: string[] = ["proceso", "fecha", "status"];
  dataSource;

  // Preliminar
  columnsPreliminar = ["estudios", "revision", "publicar"];
  datosPreliminar = [{ token: null }];

  // Estudios
  columnsEstudios = ["estudios", "documentos", "revision", "publicar"];
  datosEstudios = [{ token: null, token2: null }];

  // Bandera cancelacion
  bSolicCancel: any = null;

  // Complemento
  columnsComplemento = ["estudios", "revision", "publicar"];
  datosComplemento = [{ token: null }];

  catAnalistas = [];
  catSelectDisctamen: any[];
  catDictamen = [
    { id: "1", name: "EN PROCESO" },
    { id: "2", name: "RECOMENDADO" },
    { id: "3", name: "NO RECOMENDADO" },
    { id: "4", name: "RECOMENDADO CON RESERVA" },
  ];
  catDictamenGNP = [
    { id: "10", name: "EN PROCESO" },
    { id: "11", name: "RIESGO 1" },
    { id: "12", name: "RIESGO 2" },
    { id: "13", name: "RIESGO 3" },
    { id: "14", name: "SIN RIESGO" },
  ];

  catPreliminar = [
    { id: "0", name: "No" },
    { id: "1", name: "Si" },
  ];

  datosSolicitud: any;
  form: FormGroup;
  estudioValid: any = "";
  catEstudios: any;
  idSolicitud: any;

  // Estatus @input
  bDictamen: any;
  bPreliminar: any;
  bComplemento: any;
  estatusGeneral: any;

  // Tabla estatus
  dataTablaEstatus: any[] = [];
  columnasTablaEstatus: any[] = [
    "estatus_solicitud",
    "estatus_asignacion",
    "estatus_agenda",
    "estatus_aplicacion",
    "estatus_dictamen",
    "estatus_preliminar",
    "dictamen",
  ];
  tipoEstudio: any = null;
  $unsubs = new Subject();

  // Cancelacion
  controlComentarioCancel = new FormControl(null);
  controlTokenCancel = new FormControl(null);
  controlEstatusDictamen = new FormControl({ value: null, disabled: true });

  mostrarEstudiosCompletos: boolean = false;
  calidadAprobada: boolean = false;
  tokenPreliminar: any;

  constructor(
    public estudiosService: EstudiosService,
    public empresasService: EmpresasService,
    private router: Router,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private empleadosService: EmpleadosService,
    public estudiosAnalistaService: EstudiosAnalistaService
  ) {
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

  ngOnDestroy(): void {
    this.$unsubs.next();
    this.$unsubs.complete();
  }

  ngAfterViewInit() {
    this.form.get("iIdEstudio").valueChanges.subscribe((value) => {
      if (
        value == 1 ||
        value == 3 ||
        value == 4 ||
        value == 5 ||
        value == 7 ||
        value == 10 ||
        value == 11 ||
        value == 12
      ) {
        this.mostrarEstudiosCompletos = true;
      } else {
        this.mostrarEstudiosCompletos = false;
      }
    });
  }

  private getCatAnalistas(): void {
    this.empleadosService
      .getEmpleados()
      .pipe(
        takeUntil(this.$unsubs),
        pluck("Empleados"),
        flatMap((r: any) => r),
        filter((val: any) => val.iIdRol == 3),
        toArray(),
        catchError((err) => of([]))
      )
      .subscribe((analistas: Array<any>) => {
        this.catAnalistas = analistas;
      });
  }

  private getUrlId(): Promise<boolean> {
    let idUrl = this.route.snapshot.paramMap.get("id");
    let req = {
      sService: "getSolicitudById",
      IdSolicitud: idUrl,
    };
    if (idUrl) {
      this.loading = true;
      this.estudiosService
        .getEstudioById(req)
        .pipe(
          takeUntil(this.$unsubs),
          map((r) => r.resultado)
        )
        .subscribe(
          (datosUsuario) => {
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
            this.calidadAprobada =
              datosUsuario[0].bCertificadoCalidad == "0" ? false : true;
            this.setDatosPreliminar(datosUsuario[0]);
            this.setDatosEstudioDictamen(datosUsuario[0]);
            this.setDatosComplemento(datosUsuario[0]);
            this.setDatos(this.datosSolicitud);

            // Tokens
            this.tokenPreliminar = datosUsuario[0].sArchivoPreliminar;

            // Tabla estatus
            this.ELEMENT_DATA[0].status = datosUsuario[0].iPublicarPreliminar;
            this.ELEMENT_DATA[1].status = datosUsuario[0].bPublicarDictamen;
            this.ELEMENT_DATA[2].status = datosUsuario[0].iEstatusComplemento;

            this.loading = false;
          },
          (err) => (this.loading = false),
          () => (this.loading = false)
        );
    } else {
      this.loading = false;
      return this.router.navigate(["/ejecutivo/estudios"]);
    }
  }

  solicitudCancelacion(iIdSolicitud) {
    let req = {
      sService: "getSolicitudesCancela",
      iIdSolicitud,
    };
    this.estudiosService
      .getsolicitudCanceladaById(req)
      .pipe(
        filter((value: any) => value.LstEstudios.length > 0),
        pluck("LstEstudios")
        // catchError((err) => of([]))
      )
      .subscribe((estudio) => {
        this.controlTokenCancel.patchValue(estudio[0].sTokenEvidencia);
        this.controlComentarioCancel.patchValue(estudio[0].sComentarios);
        this.controlComentarioCancel.disable();
      });
  }

  datosTablaEstatus(data) {
    const {
      bDeclinada,
      bValidada,
      iIdEmpleadoLogistica,
      iContadoAgendas,
      bAgendaRealizada,
      iPublicarPreliminar,
      bEstatusAsignacion,
      iEstatusGeneral,
      iEstatusDictamen,
      bPublicarDictamen,
    } = data;
    this.dataTablaEstatus = [
      {
        bDeclinada,
        bValidada,
        iIdEmpleadoLogistica,
        iContadoAgendas,
        bAgendaRealizada,
        iPublicarPreliminar,
        bEstatusAsignacion,
        iEstatusGeneral,
        iEstatusDictamen,
        bPublicarDictamen,
      },
    ];
  }

  getCatalogoEstudios(): void {
    this.empresasService
      .getCatalogoEstudios(this.param)
      .pipe(takeUntil(this.$unsubs))
      .subscribe((resp: any) => {
        this.catEstudios = resp.LstEstudios;
      });
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

  private formInit(): void {
    this.form = this.fb.group({
      iIdSolicitud: new FormControl({ value: "" }),
      dFechaSolicitud: new FormControl({ value: "" }),
      iIdCliente: new FormControl({ value: "" }),
      iIdEstudio: new FormControl({ value: "", disabled: true }),
      sFolio: new FormControl({ value: "", disabled: true }),
      bPreliminar: new FormControl({ value: "" }),
      iIdAnalista: new FormControl({ value: "" }),
      sComentarios: new FormControl({ value: "" }),
      sNombres: new FormControl({ value: "" }),
      sApellidos: new FormControl({ value: "" }),
      sPuesto: new FormControl({ value: "" }),
      sTokenCV: new FormControl({ value: "" }),
      sTelefono: new FormControl({ value: "" }),
      sNss: new FormControl({ value: "" }),
      sCurp: new FormControl({ value: "" }),
      sCalleNumero: new FormControl({ value: "" }),
      sColonia: new FormControl({ value: "" }),
      sCp: new FormControl({ value: "" }),
      sMunicipio: new FormControl({ value: "" }),
      sEstado: new FormControl({ value: "" }),
      bDeclinada: new FormControl({ value: "" }),
      bValidada: new FormControl({ value: "" }),
      bPublicarDictamen: new FormControl({ value: "" }),
      bSolicitarCalidad: new FormControl({ value: "" }),
      bCertificadoCalidad: new FormControl({ value: "" }),
      iPublicarPreliminar: new FormControl({ value: "" }),
    });
  }

  setDatos(value) {
    // estatusDictamen
    this.controlEstatusDictamen.setValue(value.iEstatusDictamen);
    this.form.patchValue(value);

    // solicitudCancelacion
    if (this.bSolicCancel == "1") {
      this.solicitudCancelacion(value.iIdSolicitud);
    }
  }

  update($event) {
    this.getUrlId();
  }

  checkEstatus(estatus, id) {
    if (id == 1) {
      if (estatus == 0) return "No aplica";
      if (estatus == 1) return "En proceso";
      if (estatus == 2) return "Subido";
      if (estatus == 3) return "Publicado";
      if (estatus == 4) return "En revisión";
      return "No aplica";
    } else {
      if (estatus == 0) return "En proceso";
      if (estatus == 1) return "En proceso";
      if (estatus == 2) return "Subido";
      if (estatus == 3) return "Publicado";
      if (estatus == 4) return "En revisión";
      return "No aplica";
    }
  }

  solicitarCancelacionEjecutivo() {
    const dialogRef = this.dialog.open(SolicitarCancelacionEjecutivoComponent, {
      width: "60%",
      data: { idSolicitud: this.idSolicitud },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  descargarEvidencia() {
    let reqToken = {
      id: "",
      token: this.controlTokenCancel.value,
    };
    this.estudiosAnalistaService.descargarPreliminar(reqToken);
  }

  aprobarCancel() {
    const dialogRef = this.dialog.open(AprobarCancelacionModalComponent, {
      width: "60%",
      maxWidth: "90%",
      data: { idSolicitud: this.idSolicitud },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.ngOnInit();
    });
  }

  actualizarEstudio() {
    this.loading = true;
    let req = this.form.getRawValue();
    req.sService = "UpdateSolicitudCompleta";
    delete req.bPreliminar;
    this.estudiosService.actualizarSolicitud(req).subscribe(
      (resp) => {
        this.loading = false;
        return Swal.fire(
          "Alerta",
          "El estudio ha sido actualizado correctamente",
          "success"
        ).then(() => {
          this.getUrlId();
        });
      },
      (e) => {
        this.loading = false;
        return Swal.fire(
          "Alerta",
          "Ha ocurrido un error al actualizar el estudio",
          "error"
        );
      }
    );
  }

  // DESCARGA CV
  descargarCV() {
    if (this.form.get("sTokenCV").value) {
      let req = {
        token: this.form.get("sTokenCV").value,
      };
      this.estudiosAnalistaService.descargarPreliminar(req);
    }
  }
  // DESCARGA Preliminar
  descargarPreliminar() {
    let req = {
      token: this.tokenPreliminar,
    };
    this.estudiosAnalistaService.descargarPreliminar(req);
  }

  // abrirModalKpis() {
  //   this.dialog.open(ModaKpiComponent, {
  //     data: {
  //       idEstudio: this.idSolicitud
  //     },
  //     maxHeight: '600px'
  //     // width: '100%',
  //   })
  // }
}
