import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from "@angular/core";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";
import { EstudiosService } from "src/app/services/ejecutivo/estudios.service";
import { EmpresasService } from "src/app/services/coordinador/empresas.service";
import { EmpleadosService } from "src/app/services/coordinador/empleados.service";
import {
  flatMap,
  tap,
  filter,
  pluck,
  toArray,
  catchError,
  debounceTime,
  takeUntil,
  switchMap,
} from "rxjs/operators";
import { forkJoin, of, Subject, Subscription } from "rxjs";
import { ClienteService } from "src/app/services/cliente/cliente.service";
import { EstudiosAnalistaService } from "src/app/services/analista/estudios-analista.service";
import { ClientesService } from "src/app/services/coordinador/clientes.service";
import { EncriptarDesencriptarService } from "src/app/services/encriptar-desencriptar.service";
import { MatButton, MatDialog } from "@angular/material";
import { AprobarCancelacionModalComponent } from "src/app/components/talenti/ejecutivo/modals/aprobar-cancelacion-modal/aprobar-cancelacion-modal.component";
import { SepomexService } from "src/app/services/sepomex.service";

import * as XLSX from "xlsx";
import { HttpErrorResponse } from "@angular/common/http";

export interface DataExcel {
  Asesor: string;
  CUA: number;
  DA: number;
  Materno: string;
  Paterno: string;
  Nombre: string;
  Folio: number;
}

@Component({
  selector: "app-solicitar-estudio-shared",
  templateUrl: "./solicitar-estudio-shared.component.html",
  styleUrls: ["./solicitar-estudio-shared.component.scss"],
})
export class SolicitarEstudioSharedComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @ViewChild("label", { static: false }) label1: ElementRef;
  @ViewChild("btnSolicitar", { static: false }) btnSolicitar: MatButton;

  @Input() esCliente: boolean = false;
  @Input() analista: boolean = false;
  // @Input() esGNP: boolean = true;
  @Input() dataEstudio: any = false;
  @Input() regresar: any = "";
  @Input() bSolicCancel: any = null;

  param = {
    sService: "getLstEstudios",
    iIdEmpresa: 0,
  };

  reqTarifasEmpresa = {
    sService: "getTarifasxempresa",
    iIdEmpresa: "",
  };

  // Archivo
  dataArchivo: any = null;

  // catalogos
  catAnalistas: any[] = [];
  catEmpresas: any;
  catClientes: any[] = [];
  catClientesAll: any[] = [];

  // controls
  controlEmpresa = new FormControl(null);
  controlCliente = new FormControl(null);

  loading: boolean = false;
  controlCV = new FormControl(null);
  idSolicitud: any;
  public estudiosData: Array<Object> = [];
  form: FormGroup;
  preliminarList = [
    { nombre: "SI", value: "1" },
    { nombre: "NO", value: "0" },
  ];

  // Datos cancelacion
  controlComentarioCancel = new FormControl(null);
  controlTokenCancel = new FormControl(null);

  subs = new Subscription();
  subs1 = new Subscription();
  subs2 = new Subscription();

  mostrarEstudiosCompletos: boolean = false;
  folioEditable: boolean = false;

  bTipoFolio: "e" | "f" = null;

  // estatus
  estatusGeneral: any = null;

  // Sepomex
  estados = [];
  municipios = [];
  colonias = [];

  dataExcel: DataExcel[] = [];

  $unsubscribe = new Subject();

  constructor(
    private fb: FormBuilder,
    public estudiosService: EstudiosService,
    public router: Router,
    public empresasService: EmpresasService,
    public empleadosService: EmpleadosService,
    private modal: MatDialog,
    private clienteService: ClientesService,
    public estudiosAnalistaService: EstudiosAnalistaService,
    public clientesService: ClienteService,
    private encryptService: EncriptarDesencriptarService,
    public sepomexService: SepomexService
  ) {}

  async ngOnInit() {
    this.formInit();
    this.bTipoFolio = await this.getTipoFolioUsuario();

    this.getCatalogoEstudios();
    this.consultaAnalista();
    this.getCatAnalistas();

    this.catEmpresas = await this.getEmpresas();
    let clientes = await this.getClientes();
    this.catClientesAll = clientes.Clientes;
    this.catClientes = clientes.Clientes;

    if (this.dataEstudio) {
      this.setValue();
    }
    if (this.esCliente) {
      this.getIdCliente();
      this.getTarifasCliente();
    }
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

    //CP
    this.form
      .get("sCp")
      .valueChanges.pipe(debounceTime(500), takeUntil(this.$unsubscribe))
      .subscribe((cp) => {
        this.sepomexService
          .getEstadoByCp(cp)
          .pipe(takeUntil(this.$unsubscribe))
          .subscribe((resp: any) => {
            if (resp.status == "Ok") this.estados = resp.Estado;
          });
        this.sepomexService
          .getMunicipioByCp(cp)
          .pipe(takeUntil(this.$unsubscribe))
          .subscribe((resp: any) => {
            if (resp.status == "Ok") this.municipios = resp.Municipio;
          });
        this.sepomexService
          .getColoniasByCp(cp)
          .pipe(takeUntil(this.$unsubscribe))
          .subscribe((resp: any) => {
            if (resp.status == "Ok") this.colonias = resp.Colonias;
          });
      });

    // controlCliente
    this.controlCliente.valueChanges.subscribe((value) => {
      this.controlEmpresa.patchValue(value.iIdEmpresa);
      this.form.get("iIdCliente").patchValue(value.iIdCliente);
    });

    // controlEmpresa
    this.controlEmpresa.valueChanges.subscribe((value) => {
      if (value) {
        this.catClientes = this.catClientesAll.filter(
          (cliente) => cliente.iIdEmpresa == value
        );
        let folioE = this.catEmpresas.filter((emp) => emp.iIdEmpresa == value);

        if (folioE.length > 0) {
          if (folioE[0].sTipoFolio == "e") {
            this.folioEditable = true;
          } else {
            this.folioEditable = false;
          }
        }
      }
    });
  }

  getTipoFolioUsuario() {
    let tipopFolio = localStorage.getItem("tipoFolio");
    if (tipopFolio)
      return this.encryptService.desencriptar(tipopFolio).toPromise();
  }

  getTarifasCliente() {
    let idEmpresaStorage = localStorage.getItem("idEmpresa");
    if (idEmpresaStorage) {
      this.encryptService
        .desencriptar(idEmpresaStorage)
        .subscribe((idEmpresa) => {
          this.reqTarifasEmpresa.iIdEmpresa = idEmpresa;
          this.empresasService
            .getTarifas(this.reqTarifasEmpresa)
            .pipe(
              pluck("resultado"),
              catchError((err) => of([]))
            )
            .subscribe((tarifas: any) => {
              if (!tarifas)
                return Swal.fire(
                  "Alerta",
                  "No se pudo encontrar la empresa perteneciente",
                  "warning"
                );
              this.estudiosData = tarifas;
            });
        });
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
    this.subs1.unsubscribe();
    this.subs2.unsubscribe();
    this.$unsubscribe.next(true);
    this.$unsubscribe.complete();
  }

  getCatAnalistas() {
    this.subs = this.empleadosService
      .getEmpleados()
      .pipe(
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

  getIdCliente() {
    let idClienteD = localStorage.getItem("idCliente");
    this.encryptService.desencriptar(idClienteD).subscribe((res) => {
      this.form.get("iIdCliente").patchValue(res);
      console.log("idCliente", res);
    });
  }

  consultaAnalista() {
    if (this.analista || this.dataEstudio) {
      // this.form.disable();
    }
  }

  getEmpresas() {
    return this.empresasService.getEmpresas().toPromise();
    // .subscribe((empresa: any) => {
    //   this.catEmpresas = empresa;
    // })
  }

  getClientes() {
    return this.clienteService.getClientes().toPromise();
    // .subscribe((clientes) => {
    //   this.catClientesAll = clientes.Clientes;
    //   this.catClientes = clientes.Clientes;
    // })
  }

  selectEmpresa({ value }) {
    let filter = this.catClientesAll.filter(
      (cliente) => cliente.iIdEmpresa == value
    );
    this.catClientes = filter;
  }

  getCatalogoEstudios() {
    this.subs1 = this.empresasService
      .getCatalogoEstudios(this.param)
      .subscribe((resp: any) => {
        this.estudiosData = resp.LstEstudios;
      });
  }

  formInit() {
    this.form = this.fb.group({
      sService: new FormControl("SolicitarEstudio"),
      iIdCliente: new FormControl(null, Validators.required),
      iIdEstudio: new FormControl("", [Validators.required]),
      sFolio: new FormControl(""),
      iPublicarPreliminar: new FormControl(),
      sComentarios: new FormControl("", [Validators.required]),
      iIdAnalista: new FormControl(null, Validators.required),
      sTokenCV: new FormControl(null),
      sNombres: new FormControl("", [Validators.required]),
      sApellidos: new FormControl("", [Validators.required]),
      sPuesto: new FormControl("", [Validators.required]),
      sTelefono: new FormControl("", [Validators.required]),
      sNss: new FormControl("", [Validators.required]),
      sCurp: new FormControl("", [Validators.required]),
      sCalleNumero: new FormControl("", [Validators.required]),
      sColonia: new FormControl("", [Validators.required]),
      sCp: new FormControl("", [Validators.required]),
      sMunicipio: new FormControl("", [Validators.required]),
      sEstado: new FormControl("", [Validators.required]),
    });
  }

  regresarFunc() {
    this.router.navigate([this.regresar]);
  }

  setValue() {
    const {
      iIdSolicitud,
      iIdCliente,
      iIdEstudio,
      iPublicarPreliminar,
      iEstatusGeneral,
      sFolio,
      bPreliminar,
      iIdAnalista,
      sComentarios,
      sNombres,
      sApellidos,
      sPuesto,
      sTokenCV,
      sTelefono,
      sNss,
      sCurp,
      sCalleNumero,
      sColonia,
      sCp,
      sMunicipio,
      sEstado,
    } = this.dataEstudio;

    this.idSolicitud = iIdSolicitud;
    this.controlCV.disable();
    this.estatusGeneral = iEstatusGeneral;
    if (iEstatusGeneral == "4") {
      this.form.get("iIdAnalista").disable();
    }

    // setCliente
    let cliente = this.catClientes.filter((cl) => {
      return cl.iIdCliente == iIdCliente;
    });

    this.controlCliente.patchValue(cliente[0]);
    this.controlEmpresa.disable();
    this.controlCliente.disable();

    this.form.patchValue({
      iIdCliente,
      iIdEstudio: iIdEstudio,
      sFolio,
      iPublicarPreliminar,
      bPreliminar,
      sComentarios,
      iIdAnalista,
      sTokenCV,
      sNombres,
      sApellidos,
      sPuesto,
      sTelefono,
      sNss,
      sCurp,
      sCalleNumero,
      sColonia,
      sCp,
      sMunicipio,
      sEstado,
    });

    if (!this.esCliente) {
      this.form.get("iPublicarPreliminar").enable();
      this.form.get("iIdAnalista").enable();
    }

    // solicitudCancelacion
    if (this.bSolicCancel == "1") {
      this.solicitudCancelacion(iIdSolicitud);
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

  getDataArchivo(e) {
    this.dataArchivo = e;
    let name = e.target.files[0].name;
    this.label1.nativeElement.innerText = name;
  }

  subirArchivo() {
    if (this.dataArchivo) {
      this.loading = true;
      let name = this.dataArchivo.target.files[0].name;
      let blob = this.dataArchivo.target.files[0];
      console.log(blob, name);

      return this.empresasService.subirArchivo(blob, name).toPromise();
    }
    this.loading = false;
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

  async enviar(param: "validar" | "crearValidar" | "solicitar", row) {
    this.btnSolicitar.disabled = true;

    // Archivo
    if (param != "validar") {
      try {
        const resp: any = await this.subirArchivo();
        if (!resp.Identificador || resp.resultado != "Ok") {
          this.controlCV.setValue(null);
          this.label1.nativeElement.innerText = "Subir CV";
          this.loading = false;
          return Swal.fire(
            "Error al cargar archivo",
            "Revisa que sea un formato DOCX o PDF" + resp,
            "error"
          ).then(() => {
            this.btnSolicitar.disabled = false;
          });
        }
        this.form.get("sTokenCV").patchValue(resp.Identificador);
        this.loading = false;
      } catch (err) {
        this.loading = false;
        return Swal.fire(
          "Error al cargar archivo",
          "Revisa que sea un formato DOCX o PDF" + err,
          "error"
        ).then(() => {
          this.btnSolicitar.disabled = false;
        });
      }
    }

    // this.form.get('sFolio').setValue(Math.floor(Math.random()*10));
    let req = this.form.getRawValue();

    // let reqValidar = {
    //   sService: 'validarSolicitud',
    //   iIdSolicitud: this.idSolicitud,
    //   iIdAnalista: this.form.get('iIdAnalista').value
    // }

    switch (param) {
      case "crearValidar":
        this.estudiosService.crearEstudio(req).subscribe(
          (res: any) => {
            if (res.resultado == "Ok") {
              return Swal.fire(
                "Registro exitoso",
                `Se ha registrado un nuevo estudio exitosamente`,
                "success"
              ).then((r) => {
                this.router.navigate(["/ejecutivo/estudios"]);
              });
            } else {
              this.btnSolicitar.disabled = false;
              return Swal.fire("Error", `Error al registrar Estudio`, "error");
            }
          },
          (err) => {
            this.btnSolicitar.disabled = false;
            return Swal.fire("Error", `Error al registrar Estudio`, "error");
          }
        );
        break;

      // SOLO VALIDAR - EJECUTIVO
      case "validar":
        if (req.iIdAnalista) {
          req.sService = "validarSolicitud";
          req.iIdSolicitud = this.idSolicitud;
          delete req.iIdCliente;
          delete req.iIdEstudio;

          this.estudiosService.validarSolicitud(req).subscribe(
            (res: any) => {
              if (res.resultado == "Ok") {
                return Swal.fire(
                  "Validación exitosa",
                  `Se ha validado el estudio con folio ${req.sFolio}`,
                  "success"
                ).then((r) => {
                  this.router.navigate([this.regresar]);
                  this.btnSolicitar.disabled = false;
                });
              }
              this.btnSolicitar.disabled = false;
              return Swal.fire("Error", `Error al validar estudio`, "error");
            },
            (err) => {
              this.btnSolicitar.disabled = false;
              return Swal.fire("Error", `Error al validar estudio`, "error");
            }
          );
        } else {
          this.btnSolicitar.disabled = false;
          return Swal.fire(
            "Error",
            "Falta llenar el campo analista",
            "warning"
          );
        }
        break;

      case "solicitar":
        req.sService = "SolicitarEstudioCliente";
        delete req.iIdAnalista;

        this.clientesService.solicitarEstudioCliente(req).subscribe(
          (res: any) => {
            if (res.resultado == "Ok") {
              return Swal.fire(
                "Registro exitoso",
                `Se ha registrado un nuevo estudio con folio ${req.sFolio}`,
                "success"
              ).then((r) => {
                this.router.navigate([this.regresar]);
              });
            } else {
              this.btnSolicitar.disabled = false;
              return Swal.fire("Error", `Error al registrar Estudio`, "error");
            }
          },
          (err) => {
            this.btnSolicitar.disabled = false;
            return Swal.fire("Error", `Error al registrar Estudio`, "error");
          }
        );
        break;

      default:
        this.btnSolicitar.disabled = false;
        return Swal.fire("Error", `Error al registrar Estudio`, "error");
    }
  }

  declinarSolicitud() {
    Swal.fire({
      title: "Declinar solicitud",
      text: "¿Estás seguro que deseas declinar la solicitud?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Declinar",
    }).then((result) => {
      console.log(result);

      if (result.value) {
        let body = {
          sService: "declinarSolicitud",
          iIdSolicitud: this.idSolicitud,
        };
        this.estudiosService.declinarSolicitud(body).subscribe((res: any) => {
          if (res.resultado !== "Ok") {
            return Swal.fire(
              "Error",
              "Error al declinar la solicitud",
              "warning"
            ).then(() => {
              this.router.navigate(["/ejecutivo/estudios"]);
            });
          }
          return Swal.fire(
            "Solicitud declinada",
            "La solicitud se ha declinado con éxito",
            "success"
          ).then(() => {
            this.router.navigate(["/ejecutivo/estudios"]);
          });
        });
      }
    });
  }

  descargarEvidencia() {
    let reqToken = {
      id: "",
      token: this.controlTokenCancel.value,
    };

    this.estudiosAnalistaService.descargarPreliminar(reqToken);
  }

  aprobarCancel() {
    const dialogRef = this.modal.open(AprobarCancelacionModalComponent, {
      width: "60%",
      maxWidth: "90%",
      data: { idSolicitud: this.idSolicitud },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.ngOnInit();
    });
  }

  importExcel(e) {
    console.log(e);
    this.onFileChange(e);
  }

  private onFileChange(ev) {
    let workBook = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: "binary" });
      this.dataExcel = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial.push(...XLSX.utils.sheet_to_json(sheet));
        return initial;
      }, []);
      console.log(this.dataExcel);
    };
    reader.readAsBinaryString(file);
  }

  uploadExcel(): void {
    const forkGroup = this.dataExcel.reduce((acc, curr, id) => {
      let req = this.form.getRawValue();
      delete req.iIdAnalista;
      req.sService = 'SolicitarEstudioCliente';
      req.sNombres = curr.Nombre.trim();
      req.sApellidos = `${curr.Paterno.trim()} ${curr.Materno.trim()}`;
      req.sFolio = curr.Folio;
      req.iIdEstudio = 14;
      // req.sPuesto = 'NA' ;
      // req.sTokenCV = 'F521185056712449Tdocx';
      // req.sTelefono = 'NA' ;
      // req.sNss = 'NA' ;
      // req.sCurp = 'NA' ;
      // req.sCalleNumero = 'NA' ;
      // req.sColonia = 'NA' ;
      // req.sCp = 'NA' ;
      // req.sMunicipio = 'NA' ;
      // req.sEstado = 'NA';

      acc.push(this.clientesService.solicitarEstudioCliente(req));

      // acc = {
      //   ...acc,
      //   [`id${id}`]: this.clientesService.solicitarEstudioCliente(req),
      // };
      return acc;
    }, []);

    console.log(forkGroup);

    const $fork = forkJoin(forkGroup);
    $fork.subscribe({
      next: (res: any) => {
        console.log(res)
        return Swal.fire(
          "Alerta",
          `Las solicitudes se crearon correctamente`,
          "success"
        ).then(() => {
          this.regresarFunc();
        });
      },
      error: (e: HttpErrorResponse) => {
        console.log(e);
        return Swal.fire("Error", `Error al registrar estudios`, "error");
      },
    });
  }
}
