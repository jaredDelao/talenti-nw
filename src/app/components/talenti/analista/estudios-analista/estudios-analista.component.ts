import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  AfterViewInit,
  ElementRef,
  ChangeDetectorRef,
} from "@angular/core";
import {
  MatTableDataSource,
  MatPaginator,
  MatDatepicker,
  MatSidenav,
  MatSlideToggle,
  MatSort,
} from "@angular/material";
import { DatePipe } from "@angular/common";
import { FormGroup, FormControl, FormBuilder } from "@angular/forms";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import * as moment from "moment";
import { EstudiosAnalistaService } from "src/app/services/analista/estudios-analista.service";
import { GenerateExcelService } from "src/app/services/generate-excel.service";
import { EncriptarDesencriptarService } from "src/app/services/encriptar-desencriptar.service";
import { VerificarEstatusService } from "src/app/services/verificar-estatus.service";

@Component({
  selector: "app-estudios-analista",
  templateUrl: "./estudios-analista.component.html",
  styleUrls: ["./estudios-analista.component.scss"],
})
export class EstudiosAnalistaComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  displayedColumns: string[] = [
    "sFolio",
    "sNombres",
    "dFechaSolicitud",
    "dFechaAplicacion",
    "estatus_solicitud",
    "iIdEmpleadoLogistica",

    "iContadoAgendas",
    "iEstatusGeneral",
    "bPublicarDictamen",
    "iPublicarPreliminar",
    "comentarios",
  ];
  dataSource: MatTableDataSource<any>;
  loading: boolean = false;

  // request getEstudios
  req = {
    sService: "getSolicitudesAnalista",
    iIdAnalista: null,
  };

  jsonExportExcel: any;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild("fechaI", { static: false }) fechaI: MatDatepicker<any>;
  @ViewChild("fechaF", { static: false }) fechaF: MatDatepicker<any>;
  @ViewChild("sidenav", { static: false }) detallesMenu: MatSidenav;

  @ViewChild("togglePublicarPreliminar", { static: false })
  togglePreliminar: MatSlideToggle;
  @ViewChild("togglePublicarDictamen", { static: false })
  toggleDictamen: MatSlideToggle;

  fechaInicio: Date;
  fechaFin: Date;
  pipe: DatePipe;
  estudiosList: Array<any>;
  form: FormGroup;

  element: any = {};
  validarEstudio: any = "PENDIENTE";
  validarPublicacionPreeliminar: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public estudiosAnalistaService: EstudiosAnalistaService,
    private cd: ChangeDetectorRef,
    private excelGenerate: GenerateExcelService,
    private encryptService: EncriptarDesencriptarService,
    public vEstatusService: VerificarEstatusService
  ) {}

  async ngOnInit() {
    this.formInit();
    this.req.iIdAnalista = await this.getIdAnalista();
    this.getEstudios();
    this.paginator._intl.itemsPerPageLabel = "Estudios por página:";
    this.paginator.pageSize = 50;
  }

  ngOnDestroy() {}

  getIdAnalista() {
    let id = localStorage.getItem("idEmpleado");
    return this.encryptService.desencriptar(id).toPromise();
  }

  ngAfterViewInit() {
    this.form.get("fechaInicioForm").valueChanges.subscribe((v) => {
      if (v !== "" || v !== null) this.form.get("fechaFinalForm").enable();
      if (v == null || v == "") {
        this.form.get("fechaFinalForm").patchValue(null);
        this.form.get("fechaFinalForm").disable();
      }
    });
  }

  get fromDate() {
    return this.form.get("fechaInicioForm").value;
  }
  get toDate() {
    return this.form.get("fechaFinalForm").value;
  }

  formInit() {
    this.form = this.fb.group({
      fechaInicioForm: new FormControl(""),
      fechaFinalForm: new FormControl({ value: "", disabled: true }),
    });
  }

  filterFechas() {
    this.dataSource.filter = "fecha";
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getEstudios() {
    this.loading = true;
    this.estudiosAnalistaService.getEstudios(this.req).subscribe(
      (estudiosList: any) => {
        const { resultado } = estudiosList;
        this.estudiosList = resultado;
        this.jsonExportExcel = resultado;
        this.dataSource = new MatTableDataSource(this.estudiosList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        // Filtro fecha - texto
        this.dataSource.filterPredicate = (data: any, filter) => {
          if (filter == "fecha") {
            if (this.fromDate && this.toDate) {
              let nFrom = moment(this.fromDate, "YYYY-MM-DD").day(-1).format();
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
      (err) => {},
      () => (this.loading = false)
    );
  }

  clear() {
    this.dataSource.filter = "";
    this.form.reset();
  }

  detalles(data) {
    this.router.navigate([
      "/analista/detalle-estudio-analista/",
      data.iIdSolicitud,
    ]);
  }

  // verificarEstatusSolicitud(element) {

  //   const { bDeclinada, bValidada, bPublicarDictamen, bSolicitarCalidad, iPublicarPreliminar, iEstatusComplemento } = element;

  //   let complementoPend = false;
  //   let preliminarPend = false;

  //   if (iEstatusComplemento > '0' && iEstatusComplemento != '3') complementoPend = true;
  //   if (iPublicarPreliminar > '0' && iPublicarPreliminar != '3') preliminarPend = true;

  //   if (bPublicarDictamen == '4' || iPublicarPreliminar == '4' || iEstatusComplemento == '4') return 'Revisar'

  //   if (bPublicarDictamen == '3' && !complementoPend && !preliminarPend ) return 'Validado'

  //   return 'Pendiente';
  // }

  verificarEstatusSolicitud(element) {
    return this.vEstatusService.verificarEstatusSolicitud(element);
  }
  verificarEstatusPreliminar(iPublicarPreliminar) {
    return this.vEstatusService.verificarPreliminar(iPublicarPreliminar);
  }
  verificarEstatusDictamen(bPublicarDictamen, iEstatusGeneral) {
    return this.vEstatusService.verificarEstatusDictamen(
      bPublicarDictamen,
      iEstatusGeneral
    );
  }

  verificarEstatusEstudio(element) {
    const { bDeclinada, bValidada, bPublicarDictamen } = element;

    if (bPublicarDictamen == "1") return "En proceso";
    if (bPublicarDictamen == "2") return "En proceso";
    if (bPublicarDictamen == "3") return "Publicado";
    if (bPublicarDictamen == "4") return "Rechazado";
    return "Pendiente";
  }

  color(row) {
    // if (row.bDeclinada == '1') {
    //   return {'background-color': '#FEC6C0'}
    // }
    // if (row.bValidada == '1') {
    //   return {'background-color': '#ABEBC6'}
    // }
    return { "background-color": "#transparent" };
  }

  verText(e: HTMLSpanElement) {
    let text = e.innerText;

    if (text == "Pendiente") return "priority_high";
    if (text == "Validado") return "done";
    if (text == "Revisar") return "search";
  }

  verColor(e: HTMLSpanElement) {
    let text = e.innerText;
    if (text == "Pendiente") return { color: "red" };
    if (text == "Validado") return { color: "#27AE60" };
    if (text == "Revisar") return { color: "#F5B041" };
  }

  exportExcel() {
    this.loading = true;
    this.jsonExportExcel = this.dataSource.filteredData;

    const exportExc = this.jsonExportExcel.reduce((acc, v) => {
      let arr = [
        v.sFolio ? v.sFolio : v.iIdSolicitud,
        v.sNombres,
        v.sApellidos,
        v.dFechaSolicitud,
        this.obtenerEstatusSolicitud(v),
        this.obtenerEstatusPreliminar(v),
        this.obtenerEstatusDictamen(v.iEstatusGeneral, v.bPublicarDictamen),
      ];
      acc.push(arr);
      return acc;
    }, []);

    let headers = [
      "Folio",
      "Nombre",
      "Apellidos",
      "Fecha Solicitud",
      "Estatus Solicitud",
      "Estatus Preliminar",
      "Estatus Dictamen",
    ];

    this.excelGenerate.createExcel("exportExc", headers, exportExc);
    // this.ngOnInit();
    this.loading = false;
  }

  reload() {
    this.ngOnInit();
  }

  verificarRol(bPublicarDictamen, iEstatusGeneral, bValidada, bDeclinada) {
    if (
      iEstatusGeneral != 4 &&
      bPublicarDictamen &&
      bValidada == 1 &&
      bDeclinada != 1
    ) {
      switch (bPublicarDictamen) {
        case "0":
          return { "background-color": "#F9E79F" };
        case "1":
          return { "background-color": "#F9E79F" };
        case "4":
          return { "background-color": "#F9E79F" };
        default:
          return { "background-color": "transparent" };
      }
    }
  }

  obtenerEstatusSolicitud(value) {
    const { bDeclinada, bValidada, iEstatusGeneral } = value;
    if (iEstatusGeneral == "4") return "CANCELADO";
    if (bDeclinada == "1") return "DECLINADO";
    if (bValidada == "1") return "VALIDADO";
    return "PENDIENTE";
  }

  obtenerEstatusPreliminar(value) {
    switch (value) {
      case "0":
        return "N/A";
      case "1":
        return "PENDIENTE";
      case "2":
        return "REVISIÓN";
      case "3":
        return "PUBLICADO";
      case "4":
        return "REBOTADO";
    }
  }

  obtenerEstatusDictamen(iEstatusGeneral, bPublicarDictamen) {
    if (iEstatusGeneral == "4") return "CANCELADO";
    switch (bPublicarDictamen) {
      case "0":
        return "PENDIENTE";
      case "1":
        return "PENDIENTE";
      case "2":
        return "REVISIÓN";
      case "3":
        return "PUBLICADO";
      case "4":
        return "REBOTADO";
    }
  }
}
