import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef, OnDestroy } from "@angular/core";
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from "@angular/material/table";
import { MatDatepicker, MatSidenav, MatSlideToggle, MatSort } from '@angular/material';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { EstudiosService } from 'src/app/services/ejecutivo/estudios.service';
import { Estudio } from 'src/app/interfaces/talenti/ejecutivo/estudios';
import {MatDialog} from '@angular/material/dialog';
import { ModalDireccionComponent } from '../modals/modal-direccion/modal-direccion.component';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import * as moment from 'moment'
import { GenerateExcelService } from 'src/app/services/generate-excel.service';
import { EncriptarDesencriptarService } from 'src/app/services/encriptar-desencriptar.service';
import { VerificarEstatusService } from 'src/app/services/verificar-estatus.service';
import { ClientesService } from 'src/app/services/coordinador/clientes.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EmpresasService } from 'src/app/services/coordinador/empresas.service';

@Component({
  selector: "app-datos-ejecutivo",
  templateUrl: "./datos-ejecutivo.component.html",
  styleUrls: ["./datos-ejecutivo.component.scss"]
})
export class DatosEjecutivoComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  displayedColumns: string[] = [
    'sFolio', 'sNombres', 'cliente', 'sNombreEstudio', 'solicitante', 'analista', 'fecha_solicitud', 'dFechaAplicacion', 'dFechaPreliminar', 'dFechaPublicacion', 'bPublicarDictamen', 'comentarios'
  ];
  dataSource: MatTableDataSource<Estudio>;
  loader: boolean = false;

  req = {
    sService: 'getSolicitudesEjecutivo',
    iIdEjecutivo: null
  }

  jsonExportExcel: any;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('fechaI', { static: false }) fechaI: MatDatepicker<any>;
  @ViewChild('fechaF', { static: false }) fechaF: MatDatepicker<any>;
  @ViewChild('sidenav', {static: false}) detallesMenu: MatSidenav;
  @ViewChild('togglePublicarPreliminar', {static: false}) togglePreliminar: MatSlideToggle;
  @ViewChild('togglePublicarDictamen', {static: false}) toggleDictamen: MatSlideToggle;

  fechaInicio: Date;
  fechaFin: Date;
  pipe: DatePipe;
  estudiosList: Array<any>;
  form: FormGroup;

  element: any = {};
  validarEstudio: any = 'PENDIENTE';
  validarPublicacionPreeliminar: boolean = false;
  bTipoFolio: 'e' | 'f' = null;

  sortedData: any[];

  catClientes: any[] = [];

  $unsubscribe = new Subject();

  constructor(private estudiosService: EstudiosService, private fb: FormBuilder, private excelGenerate: GenerateExcelService, public vEstatusService: VerificarEstatusService,
    public dialog: MatDialog, private cd: ChangeDetectorRef, private router: Router, private encryptService: EncriptarDesencriptarService, private clientesService: ClientesService,
    private empresasService: EmpresasService) {
    this.pipe = new DatePipe('en');
  }

  async ngOnInit() {
    this.getClientes();
    this.formInit();
    this.req.iIdEjecutivo = await this.getIdEjecutivo();
    this.bTipoFolio = await this.getTipoFolioUsuario();
    this.getEstudios();

    this.paginator._intl.itemsPerPageLabel = 'Estudios por página:';
    this.paginator.pageSize = 50;
  }

  ngAfterViewInit() {
    this.form.get('fechaInicioForm').valueChanges.pipe(takeUntil(this.$unsubscribe)).subscribe((v) => {
      if (v !== '' || v !== null) this.form.get('fechaFinalForm').enable();
      
      if (v == null || v == '') {        
        this.form.get('fechaFinalForm').patchValue(null);
        this.form.get('fechaFinalForm').disable();
      }
    })
  }

  ngOnDestroy() {
    this.$unsubscribe.next(true);
    this.$unsubscribe.complete();
  }

  getClientes() {
    this.empresasService.getEmpresas().pipe(
      takeUntil(this.$unsubscribe),
    ).subscribe((empresas: any) => {
      this.catClientes = empresas;      
    });
  }

  getTipoFolioUsuario() {
    let tipopFolio = localStorage.getItem('tipoFolio');
    if (tipopFolio)
    return this.encryptService.desencriptar(tipopFolio).toPromise();
  }

  getIdEjecutivo() {
    let id = localStorage.getItem('idEmpleado');
    return this.encryptService.desencriptar(id).toPromise();
  }

  get fromDate() {
    return this.form.get('fechaInicioForm').value;
  }
  get toDate() {
    return this.form.get('fechaFinalForm').value;
  }

  // Direccion modal
  verDireccion(estado, municipio) {
    let direccion = {estado, municipio};
    this.openDialogDireccion(direccion);
  }

  openDialogDireccion(direccion): void {
    const dialogRef = this.dialog.open(ModalDireccionComponent, {
      width: '400px',
      data: direccion
    });
  }

  formInit() {
    this.form = this.fb.group({
      fechaInicioForm: new FormControl({ value: '', disabled: true }),
      fechaFinalForm: new FormControl({ value: '', disabled: true }),
    })
  }

  filterFechas() {
    this.dataSource.filter = 'fecha';
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getEstudios() {
    this.loader = true;
    this.estudiosService.getEstudiosCliente(this.req).pipe(takeUntil(this.$unsubscribe)).subscribe((estudiosList: any)=> {
      const {resultado} = estudiosList;
      this.sortedData = resultado.slice();
      this.estudiosList = resultado;
      this.jsonExportExcel = resultado;
      this.dataSource = new MatTableDataSource(this.estudiosList);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

      // Filtro fecha - texto
      this.dataSource.filterPredicate = (data: any, filter) => {
        if (filter == 'fecha') {
          if (this.fromDate && this.toDate) {
            let nFrom = moment(this.fromDate, "YYYY-MM-DD").day(-1).format();
            let nTo = moment(this.toDate, "YYYY-MM-DD").format();
            return data.dFechaSolicitud >= nFrom && data.dFechaSolicitud <= nTo
          }
        } else {
          if (data.sNombres && data.sApellidos) {
            let text = (data.sNombres.concat(' ',data.sApellidos));
            return text.toLowerCase().includes(filter.trim().toLowerCase()); 
          }
        }
        return true;
      }
    }, (err) => {}, () => {
      this.loader = false;
    });
  }

  clear() {
      this.dataSource.filter = '';
      this.form.reset();
  }


  detalles(data) {
    // this.estudiosService.detalleSolicitud.next(data);
    this.router.navigate(['ejecutivo/detalle-estudio/', data.iIdSolicitud]);
    // this.detallesMenu.toggle();
    // this.element = data;
    // this.validarDeclinarEstudio();
    // this.publicarPreeliminar();
    // console.log(this.element);
  }

  validarDeclinarEstudio() {
    let validar = this.element.bDeclinada;
    let declinar = this.element.bValidada;

    // false - declinado
    // true - validado
    // '3' - pendiente

    if (validar == '1' && declinar == '1') {
      return this.validarEstudio = 'DECLINADO';
    }
    if (validar == '1' && declinar == '0') {
      return this.validarEstudio = 'VALIDADO';
    }
    if (validar == '0' && declinar == '0') {
      return this.validarEstudio = 'PENDIENTE';
    }
  }

  publicarPreeliminar() {
    
      if (this.element.bPublicarPreliminar == '1') {
        this.togglePreliminar.checked = true;
        this.togglePreliminar.disabled = true;
      }
      if (this.element.bPublicarPreliminar == '0') {
        this.togglePreliminar.checked = false;
      }
  }
  changePublicarPreeliminar({checked}) {
    // console.log(checked);
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success ml-3',
          cancelButton: 'btn btn-danger mr-3'
        },
        buttonsStyling: false
      })
      
      swalWithBootstrapButtons.fire({
        title: '¿Deseas publicar el preliminar?',
        text: "Una vez publicado no podrás deshacer el cambio",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'PUBLICAR',
        cancelButtonText: 'CANCELAR',
        reverseButtons: true
      }).then((result) => {
        if (result.value) {
          this.togglePreliminar.checked = true;
          this.togglePreliminar.disabled =true;
        } else if (
          result.dismiss === Swal.DismissReason.cancel
        ) {
          this.togglePreliminar.checked = false;
        }
      })
  
  }

  color(row) {
    // if (row.bDeclinada == '1') {
    //   return {'background-color': '#FEC6C0'}
    // }
    // if (row.bValidada == '1') {
    //   return {'background-color': '#ABEBC6'}
    // }
    return {'background-color': '#transparent'}
  }

  verText(e: HTMLSpanElement) {
    let text = e.innerText;

    if (text == 'Pendiente') return 'priority_high';
    if (text == 'Validado') return 'done';
    if (text == 'Revisar') return 'search';
  }

  verColor(e: HTMLSpanElement) {
    let text = e.innerText;
    if (text == 'Pendiente') return {'color': 'red'};
    if (text == 'Validado') return {'color': '#27AE60'};
    if (text == 'Revisar') return {'color': '#F5B041'};
  }

  renameKey(object, key, newKey) {

    const clone = (obj) => Object.assign({}, obj);

    const clonedObj = clone(object);
  
    const targetKey = clonedObj[key];
  
    delete clonedObj[key];
    clonedObj[newKey] = targetKey;  
    return clonedObj;
  }

  exportExcel() {
    this.jsonExportExcel = this.dataSource.filteredData;
    const exportExc = this.jsonExportExcel.reduce((acc, v) => {
        let arr = [
          v.iIdSolicitud, 
          v.sNombres, 
          v.sApellidos, 
          v.Nombrecte + ' ' + v.ApellidosCte, 
          "", 
          "",
          v.sUltimoAplicador, 
          v.dFechaSolicitud, 
          v.sNombreEstudio, 
          v.dFechaAplicacion, 
          v.dFechaPreliminar, 
          v.dFechaPublicacion, 
          this.obtenerEstatusDictamen(v.iEstatusGeneral, v.bPublicarDictamen),
        ];
        acc.push(arr);
        return acc;
    }, [])
    
    let headers = ['Folio', 'Nombre(s)', 'Apellidos', 'Cliente', 
      'Solicitante', 'Analista', 'Aplicador', 'Fecha solicitud', 'Estudio solicitado', 'Fecha Aplicación', 'Fecha Preeliminar', 'Fecha Publicación', 'Estatus Dictamen'];

    this.excelGenerate.createExcel('exportExc', headers, exportExc );
    // this.ngOnInit();
  }

  // verificarEstatusSolicitud(element) {
  //   return this.vEstatusService.verificarEstatusSolicitud(element);
  // }

  // verificarEstatusDictamen(bPublicarDictamen, iEstatusGeneral) {
  //   return this.vEstatusService.verificarEstatusDictamen(bPublicarDictamen, iEstatusGeneral);
  // }

  // verificarPreliminar(iPublicarPreliminar) {
  //   console.log(iPublicarPreliminar);
    
  //   return this.vEstatusService.verificarPreliminar(iPublicarPreliminar);
  // }

  // verificarRol(bPublicarDictamen, iEstatusGral, bDeclinada) {
  //   if (iEstatusGral != '4' && bPublicarDictamen && bDeclinada != '1') {

  //     switch(bPublicarDictamen) {
  //       case '0':
  //         return {'background-color': '#F9E79F'};
  //       case '1':
  //         return {'background-color': '#F9E79F'};
  //       case '2':
  //         return {'background-color': '#F9E79F'};
  //       default:
  //         return {'background-color': 'transparent'}
  //     }
  //   }
  // }

  obtenerEstatusDictamen(iEstatusGeneral, bPublicarDictamen) {
    if (iEstatusGeneral == '4') return 'CANCELADO';
    switch(bPublicarDictamen) {
      case '0':
        return 'PENDIENTE';
      case '1':
        return 'PENDIENTE';
      case '2':
        return 'REVISIÓN';
      case '3':
        return 'PUBLICADO';
      case '4':
        return 'REBOTADO';
    }
  }

  reload() {
    this.ngOnInit();
  }

}
