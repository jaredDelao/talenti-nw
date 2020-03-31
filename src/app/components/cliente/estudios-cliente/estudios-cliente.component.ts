import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDatepicker, MatSidenav, MatSlideToggle, MatDialog } from '@angular/material';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { EstudiosService } from 'src/app/services/ejecutivo/estudios.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { EncriptarDesencriptarService } from 'src/app/services/encriptar-desencriptar.service';

@Component({
  selector: 'app-estudios-cliente',
  templateUrl: './estudios-cliente.component.html',
  styleUrls: ['./estudios-cliente.component.scss']
})
export class EstudiosClienteComponent implements OnInit {

  displayedColumns: string[] = [
    'folio', 'nombre', 'fecha_solicitud', 'estatus_solicitud', 'comentarios'
  ];
  dataSource: MatTableDataSource<any>;

  req = {
    sService: 'getSolicitudesCliente',
    iIdCliente: null
  }

  fechaInicio: Date;
  fechaFin: Date;
  pipe: DatePipe;
  estudiosList: Array<any>;
  form: FormGroup;

  element: any = {};
  validarEstudio: any = 'PENDIENTE';
  validarPublicacionPreeliminar: boolean = false;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('fechaI', { static: false }) fechaI: MatDatepicker<any>;
  @ViewChild('fechaF', { static: false }) fechaF: MatDatepicker<any>;
  @ViewChild('sidenav', {static: false}) detallesMenu: MatSidenav;

  @ViewChild('togglePublicarPreliminar', {static: false}) togglePreliminar: MatSlideToggle;
  @ViewChild('togglePublicarDictamen', {static: false}) toggleDictamen: MatSlideToggle;

  constructor(private estudiosService: EstudiosService, private fb: FormBuilder, private encryptDecryptService: EncriptarDesencriptarService,
    public dialog: MatDialog, private cd: ChangeDetectorRef, private router: Router) { }

  async ngOnInit() {
    this.getIdCliente();
    this.formInit();
    this.req.iIdCliente = await this.getIdCliente();
    this.getEstudios();
  }

  get fromDate() {
    return this.form.get('fechaInicioForm').value;
  }
  get toDate() {
    return this.form.get('fechaFinalForm').value;
  }

  getIdCliente() {
    let idClienteEncrypt = localStorage.getItem('idCliente');
    return this.encryptDecryptService.desencriptar(idClienteEncrypt).toPromise();
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

    console.log(this.req);
    
    this.estudiosService.getEstudios(this.req).subscribe((estudiosList: any)=> {

      console.log(estudiosList);
      
      
      // Verificar estudios
      if(estudiosList.resultado.length <= 0) return Swal.fire('Error', 'No se encontraron estudios registrados', 'warning');

      const {resultado} = estudiosList;
      this.estudiosList = resultado;
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
    }, (err) => Swal.fire('Error', 'Error al procesar las solicitudes ' + err, 'error'));
  }

  clear() {
      this.dataSource.filter = '';
      this.form.reset();
  }


  detalles(data) {
    this.estudiosService.detalleSolicitud.next(data);
    this.router.navigate(['cliente/detalle-estudio/', data.iIdSolicitud]);
  }

  crearEstudio() {
    this.router.navigate(['cliente/solicitar-estudio/']);
  }


  verificarEstatusSolicitud(element) {

    const { bDeclinada, bValidada, bPublicarDictamen, bSolicitarCalidad, iPublicarPreliminar, iEstatusComplemento } = element;

    let complementoPend = false;
    let preliminarPend = false;

    // if (iEstatusComplemento != '3') complementoPend = true;
    if (iPublicarPreliminar == '3') return 'Publicado';
    if (bDeclinada == '1') return 'Declinado';
        
    // if (bPublicarDictamen == '3' && !complementoPend && !preliminarPend ) return 'Validado'
    
    return 'Pendiente';
  }

  color(row) {
    if (row.bDeclinada == '1') {
      return {'background-color': '#FEC6C0'}
    }
    if (row.bValidada == '1' && row.iPublicarPreliminar != '3') {
      return {'background-color': '#F9E79F'}
    }
    if (row.bValidada == '1' && row.iPublicarPreliminar == '3') {
      return {'background-color': '#D5F5E3'}
    }

    return {'background-color': '#F9E79F'}
    
  }

}
