import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDatepicker, MatSidenav, MatSlideToggle } from '@angular/material';
import { DatePipe } from '@angular/common';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { EstudiosAnalistaService } from 'src/app/services/analista/estudios-analista.service';
import { GenerateExcelService } from 'src/app/services/generate-excel.service';
import { EncriptarDesencriptarService } from 'src/app/services/encriptar-desencriptar.service';

@Component({
  selector: 'app-estudios-analista',
  templateUrl: './estudios-analista.component.html',
  styleUrls: ['./estudios-analista.component.scss']
})
export class EstudiosAnalistaComponent implements OnInit, OnDestroy, AfterViewInit {

  displayedColumns: string[] = ['folio', 'estudio', 'nombre', 'fecha_solicitud', 'estatus_solicitud', 'estatus_estudio', 'comentarios'];
  dataSource: MatTableDataSource<any>;
  loading: boolean = false;

  // request getEstudios
  req = {
    sService: 'getSolicitudesAnalista',
    iIdAnalista: null
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

  constructor(private fb: FormBuilder, private router: Router, public estudiosAnalistaService: EstudiosAnalistaService, private cd: ChangeDetectorRef, private excelGenerate: GenerateExcelService, private encryptService: EncriptarDesencriptarService) { }

  async ngOnInit() {
    this.formInit();
    this.req.iIdAnalista = await this.getIdAnalista();
    this.getEstudios();
  }

  ngOnDestroy() {

  }

  getIdAnalista() {
    let id = localStorage.getItem('idEmpleado');
    return this.encryptService.desencriptar(id).toPromise();
  }

  ngAfterViewInit() {
    
    this.form.get('fechaInicioForm').valueChanges.subscribe((v) => {
      if (v !== '' || v !== null) this.form.get('fechaFinalForm').enable();
      if (v == null || v == '') {
        this.form.get('fechaFinalForm').patchValue(null);
        this.form.get('fechaFinalForm').disable();
      }
    })
  }

  get fromDate() {
    return this.form.get('fechaInicioForm').value;
  }
  get toDate() {
    return this.form.get('fechaFinalForm').value;
  }  

  formInit() {
    this.form = this.fb.group({
      fechaInicioForm: new FormControl(''),
      fechaFinalForm: new FormControl({value: '', disabled: true}),
    })
  }

  filterFechas() {
    this.dataSource.filter = 'fecha';
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getEstudios() {
    this.estudiosAnalistaService.getEstudios(this.req).subscribe((estudiosList: any)=> {
      console.log(estudiosList);
      const {resultado} = estudiosList;
      this.estudiosList = resultado;
      this.jsonExportExcel = resultado;
      this.dataSource = new MatTableDataSource(this.estudiosList);
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
    });
  }

  clear() {
      this.dataSource.filter = '';
      this.form.reset();
  }


  detalles(data) {
    this.router.navigate(['analista/detalle-estudio-analista/', data.iIdSolicitud]);
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
    const { bDeclinada, bValidada } = element;
    if (bDeclinada == '1') return 'Declinada';
    if (bValidada == '1') return 'Validada';    
    return 'Pendiente por validar';
  }

  verificarEstatusEstudio(element) {
    const { bDeclinada, bValidada, bPublicarDictamen } = element;

    if (bPublicarDictamen == '1') return 'En proceso';
    if (bPublicarDictamen == ('2'||'3')) return 'En proceso';
    if (bPublicarDictamen == '4') return 'Publicado';    
    return 'Pendiente';
  }

  color(row) {
    if (row.bDeclinada == '1') {
      return {'background-color': '#FEC6C0'}
    }
    if (row.bValidada == '1') {
      return {'background-color': '#ABEBC6'}
    }
    return {'background-color': '#F9E79F'}
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

  exportExcel() {
    this.loading = true;
    this.jsonExportExcel = this.dataSource.filteredData;

    this.jsonExportExcel.forEach((element, i) => {
      delete element['iIdSolicitud'];
      delete element['iEstatusGeneral'];
      delete element['iIdCliente'];
      delete element['iIdSolicitud'];
      delete element['iIdAnalista'];
      delete element['sTokenCV'];
      delete element['bDeclinada'];
      delete element['bValidada'];
      delete element['bDeclinada'];
      delete element['bDeclinada'];
      delete element['bPublicarDictamen'];
      delete element['bSolicitarCalidad'];
      delete element['bCertificadoCalidad'];
      delete element['iPublicarPreliminar'];
      delete element['iEstatusDictamen'];
      delete element['sArchivoPreliminar'];
      delete element['sArch1Dictamen'];
      delete element['sArch2Dictamen'];
      delete element['sArchComplemento'];
      delete element['iEstatusComplemento'];
      delete element['sMotivoPreliminar'];
      delete element['sMotivoDictamen'];
      delete element['sMotivoComplemento'];
      delete element['sTokenComplemento'];
    });
    
    console.log(this.jsonExportExcel);
    this.excelGenerate.exportAsExcelFile(this.jsonExportExcel, 'sample');
    this.loading = false;
    
  }

}
