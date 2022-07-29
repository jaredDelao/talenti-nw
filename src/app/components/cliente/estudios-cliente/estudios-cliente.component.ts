import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  OnDestroy,
} from "@angular/core";
import {
  MatTableDataSource,
  MatPaginator,
  MatDatepicker,
  MatSidenav,
  MatSlideToggle,
  MatDialog,
  MatSort,
} from "@angular/material";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { EstudiosService } from "src/app/services/ejecutivo/estudios.service";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import * as moment from "moment";
import * as bcryptjs from "bcryptjs";
import { EncriptarDesencriptarService } from "src/app/services/encriptar-desencriptar.service";
import { clienteNormal, clienteGNP } from "../../../shared/docs/tiposDictamen";
import { VerificarEstatusService } from "src/app/services/verificar-estatus.service";
import { GenerateExcelService } from "src/app/services/generate-excel.service";
import { CurrencyPipe, DatePipe } from "@angular/common";
import { VerificarEstatusAgendaPipe } from "src/app/shared/pipes/verificar-estatus-agenda.pipe";
import { VerificarPagoPipe } from "src/app/shared/pipes/verificar-pago.pipe";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-estudios-cliente",
  templateUrl: "./estudios-cliente.component.html",
  styleUrls: ["./estudios-cliente.component.scss"],
})
export class EstudiosClienteComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  jsonExportExcel: any;

  headersUser = [
    "iIdSolicitud",
    "sNombres",
    "sNombreEstudio",
    "sMunicipio",
    "sEstado",
    "dFechaSolicitud",
    "iContadoAgendas",
    "dFechaAplicacion",
    "dFechaPreliminar",
    "dFechaPublicacion",
    "estatus",
    "comentarios",
  ];

  headersAdmin = [
    "iIdSolicitud",
    "sNombres",
    "sNombreEstudio",
    "nombrecte",
    "sMunicipio",
    "sEstado",
    "dFechaSolicitud",
    "iContadoAgendas",
    "dFechaAplicacion",
    "dFechaPreliminar",
    "dFechaPublicacion",
    "estatus",
    "cobro",
    "comentarios",
  ];

  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<any>;

  req = {
    sService: null,
    iIdCliente: null,
  };
  isPerfilAdmin: boolean = false;
  isGNP: any = null;
  estatusDictamenList = [...clienteNormal, ...clienteGNP];

  loader: boolean = false;
  fechaInicio: Date;
  fechaFin: Date;
  pipe: DatePipe;
  estudiosList: Array<any>;
  form: FormGroup;

  element: any = {};
  validarEstudio: any = "PENDIENTE";
  validarPublicacionPreeliminar: boolean = false;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild("fechaI", { static: false }) fechaI: MatDatepicker<any>;
  @ViewChild("fechaF", { static: false }) fechaF: MatDatepicker<any>;
  @ViewChild("sidenav", { static: false }) detallesMenu: MatSidenav;

  @ViewChild("togglePublicarPreliminar", { static: false })
  togglePreliminar: MatSlideToggle;
  @ViewChild("togglePublicarDictamen", { static: false })
  toggleDictamen: MatSlideToggle;

  $subs = new Subject();

  constructor(
    private estudiosService: EstudiosService,
    private fb: FormBuilder,
    private encryptDecryptService: EncriptarDesencriptarService,
    public dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private router: Router,
    public vEstatusService: VerificarEstatusService,
    private excelGenerate: GenerateExcelService,
    private datePipe: DatePipe,
    private estatusAgendaPipe: VerificarEstatusAgendaPipe,
    private pagoPipe: VerificarPagoPipe,
    private currencyPipe: CurrencyPipe
  ) {}

  async ngOnInit() {
    this.formInit();
    // IdCliente
    this.req.iIdCliente = await this.getIdCliente();
    // Perfil cliente - Admin o User
    this.isPerfilAdmin = await this.getPerfil();
    if (this.isPerfilAdmin) this.displayedColumns = this.headersAdmin;
    else this.displayedColumns = this.headersUser;

    this.isGNP = await this.getIsGnp();
    this.getEstudios();

    this.paginator._intl.itemsPerPageLabel = "Estudios por página:";
    this.paginator.pageSize = 50;
  }

  ngOnDestroy(): void {
    this.$subs.next();
    this.$subs.complete();
  }

  get fromDate() {
    return this.form.get("fechaInicioForm").value;
  }
  get toDate() {
    return this.form.get("fechaFinalForm").value;
  }

  getIdCliente() {
    let idClienteEncrypt = localStorage.getItem("idCliente");
    return this.encryptDecryptService
      .desencriptar(idClienteEncrypt)
      .toPromise();
  }

  getIsGnp() {
    let isGnp = localStorage.getItem("isGnp");
    return this.encryptDecryptService.desencriptar(isGnp).toPromise();
  }

  getPerfil() {
    let perfil = localStorage.getItem("perfil");
    return bcryptjs.compare("Admin", perfil);
  }

  formInit() {
    this.form = this.fb.group({
      fechaInicioForm: new FormControl({ value: "", disabled: true }),
      fechaFinalForm: new FormControl({ value: "", disabled: true }),
    });
  }

  filterFechas() {
    this.dataSource.filter = "fecha";
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private getEstudios(): void {
    this.loader = true;

    if (this.isPerfilAdmin) this.req.sService = "getSolicitudesClienteAdmin";
    if (this.isPerfilAdmin == false)
      this.req.sService = "getSolicitudesCliente";

    this.estudiosService
      .getEstudiosCliente(this.req)
      .pipe(takeUntil(this.$subs))
      .subscribe(
        (estudiosList: any) => {
          // Verificar estudios
          if (estudiosList.resultado.length <= 0)
            return Swal.fire(
              "Error",
              "No se encontraron estudios registrados",
              "warning"
            );

          const { resultado } = estudiosList;
          this.jsonExportExcel = resultado;
          this.estudiosList = resultado;
          this.dataSource = new MatTableDataSource(this.estudiosList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

          // Filtro fecha - texto
          this.dataSource.filterPredicate = (data: any, filter) => {
            if (filter == "fecha") {
              if (this.fromDate && this.toDate) {
                let nFrom = moment(this.fromDate, "YYYY-MM-DD")
                  .day(-1)
                  .format();
                let nTo = moment(this.toDate, "YYYY-MM-DD").format();
                return (
                  data.dFechaSolicitud >= nFrom && data.dFechaSolicitud <= nTo
                );
              }
            } else {
              if (data.sNombres && data.sApellidos) {
                let text = data.sNombres.concat(" ", data.sApellidos);
                return text.toLowerCase().includes(filter.trim().toLowerCase());
              }
            }
            return true;
          };
        },
        (err) => {
          this.loader = false;
          return Swal.fire(
            "Error",
            "Error al procesar las solicitudes " + err,
            "error"
          );
        },
        () => (this.loader = false)
      );
  }

  clear() {
    this.dataSource.filter = "";
    this.form.reset();
  }

  detalles(data) {
    this.estudiosService.detalleSolicitud.next(data);
    this.router.navigate(["cliente/detalle-estudio/", data.iIdSolicitud]);
  }

  crearEstudio() {
    this.router.navigate(["cliente/solicitar-estudio/"]);
  }

  color(row) {
    // if (row.bDeclinada == '1') {
    //   return {'background-color': '#FEC6C0'}
    // }
    // if (row.bValidada == '1') {
    //   return {'background-color': '#ABEBC6'}
    // }
    // return {'background-color': '#F9E79F'}
    return { "background-color": "transparent" };
  }

  // verificarEstatusSolicitud(element) {
  //   return this.vEstatusService.verificarEstatusSolicitud(element);
  // }

  // verificarDictamen(idDictamen, iEstatusGeneral) {
  //   return this.vEstatusService.verificarDictamen(idDictamen, iEstatusGeneral);
  // }

  // verificarEstatusDictamen(bPublicarDictamen, iEstatusGeneral) {
  //   return this.vEstatusService.verificarEstatusDictamen(bPublicarDictamen, iEstatusGeneral);
  // }

  reload() {
    this.ngOnInit();
  }

  exportExcel() {
    this.jsonExportExcel = this.dataSource.filteredData;
    let exportExc;
    let headers;

    if (this.req.sService === "getSolicitudesClienteAdmin") {
      exportExc = this.jsonExportExcel.reduce((acc, v) => {
        let arr = [
          v.iIdSolicitud,
          v.sNombres + " " + v.sApellidos,
          v.sNombreEstudio,
          v.nombrecte + " " + v.apellidoscte,
          v.sMunicipio,
          v.sEstado,
          this.datePipe.transform(v.dFechaSolicitud, "dd/MMM/yyyy"),
          this.estatusAgendaPipe.transform(v.iContadoAgendas),
          this.datePipe.transform(v.dFechaAplicacion, "dd/MMM/yyyy"),
          this.datePipe.transform(v.dFechaPreliminar, "dd/MMM/yyyy"),
          this.datePipe.transform(v.dFechaPublicacion, "dd/MMM/yyyy"),
          this.obtenerEstatusSolicitud(v),
          this.currencyPipe.transform(this.pagoPipe.transform(v)),
        ];
        acc.push(arr);
        return acc;
      }, []);

      headers = [
        "Folio",
        "Nombre del candidato",
        "Tipo de Estudio",
        "Usuario",
        "Municipio",
        "Estado",
        "Fecha Solicitud",
        "Estatus Agenda",
        "Fecha Aplicación",
        "Fecha Preliminar",
        "Fecha Publicacion",
        "Estatus",
        "Cobro",
      ];
    } else {
      exportExc = this.jsonExportExcel.reduce((acc, v) => {
        let arr = [
          v.iIdSolicitud,
          v.sNombres + " " + v.sApellidos,
          v.sNombreEstudio,
          v.sMunicipio,
          v.sEstado,
          this.datePipe.transform(v.dFechaSolicitud, "dd/MMM/yyyy"),
          this.estatusAgendaPipe.transform(v.iContadoAgendas),
          this.datePipe.transform(v.dFechaAplicacion, "dd/MMM/yyyy"),
          this.datePipe.transform(v.dFechaPreliminar, "dd/MMM/yyyy"),
          this.datePipe.transform(v.dFechaPublicacion, "dd/MMM/yyyy"),
          this.obtenerEstatusSolicitud(v),
        ];
        acc.push(arr);
        return acc;
      }, []);

      headers = [
        "Folio",
        "Nombre del candidato",
        "Tipo de Estudio",
        "Municipio",
        "Estado",
        "Fecha Solicitud",
        "Estatus Agenda",
        "Fecha Aplicación",
        "Fecha Preliminar",
        "Fecha Publicacion",
        "Estatus",
      ];
    }

    this.excelGenerate.createExcel("exportExc", headers, exportExc);
  }

  obtenerEstatusSolicitud(value) {
    const { bDeclinada, bValidada, iEstatusGeneral } = value;
    if (iEstatusGeneral == "4") return "CANCELADO";
    if (bDeclinada == "1") return "DECLINADO";
    if (bValidada == "1") return "VALIDADO";
    return "PENDIENTE";
  }
}
