import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDatepicker, MatSidenav, MatSlideToggle, MatDialog } from '@angular/material';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { EstudiosService } from 'src/app/services/ejecutivo/estudios.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import * as bcryptjs from 'bcryptjs';
import { EncriptarDesencriptarService } from 'src/app/services/encriptar-desencriptar.service';
import { clienteNormal, clienteGNP } from '../../../shared/docs/tiposDictamen';
import { VerificarEstatusService } from 'src/app/services/verificar-estatus.service';

@Component({
  selector: 'app-estudios-cliente',
  templateUrl: './estudios-cliente.component.html',
  styleUrls: ['./estudios-cliente.component.scss']
})
export class EstudiosClienteComponent implements OnInit {

  displayedColumns: string[] = [
    'folio', 'nombre', 'fecha_solicitud', 'estatus_solicitud', 'estatus_dictamen', 'dictamen', 'comentarios'
  ];
  dataSource: MatTableDataSource<any>;

  req = {
    sService: null,
    iIdCliente: null
  }
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
  validarEstudio: any = 'PENDIENTE';
  validarPublicacionPreeliminar: boolean = false;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('fechaI', { static: false }) fechaI: MatDatepicker<any>;
  @ViewChild('fechaF', { static: false }) fechaF: MatDatepicker<any>;
  @ViewChild('sidenav', {static: false}) detallesMenu: MatSidenav;

  @ViewChild('togglePublicarPreliminar', {static: false}) togglePreliminar: MatSlideToggle;
  @ViewChild('togglePublicarDictamen', {static: false}) toggleDictamen: MatSlideToggle;

  constructor(private estudiosService: EstudiosService, private fb: FormBuilder, private encryptDecryptService: EncriptarDesencriptarService,
    public dialog: MatDialog, private cd: ChangeDetectorRef, private router: Router, public vEstatusService: VerificarEstatusService) { }

  async ngOnInit() {    
    this.formInit();
    // IdCliente
    this.req.iIdCliente = await this.getIdCliente();
    // Perfil cliente - Admin o User
    this.isPerfilAdmin = await this.getPerfil();
    // IsGNP
    this.isGNP = await this.getIsGnp();
    console.log('GNP::', this.isGNP);
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

  getIsGnp() {
    let isGnp = localStorage.getItem('isGnp');
    return this.encryptDecryptService.desencriptar(isGnp).toPromise();
  }

  getPerfil() {
    let perfil = localStorage.getItem('perfil');
    return bcryptjs.compare('Admin', perfil)
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

    // console.log(this.isPerfilAdmin);
    if (this.isPerfilAdmin) this.req.sService = 'getSolicitudesClienteAdmin';
    if (this.isPerfilAdmin == false) this.req.sService = 'getSolicitudesCliente';
    console.log('Request', this.req)
    
    this.estudiosService.getEstudiosCliente(this.req).subscribe((estudiosList: any)=> {
      console.log('DATA::', estudiosList);
      
      
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
    }, (err) => {
      this.loader = false;
      return Swal.fire('Error', 'Error al procesar las solicitudes ' + err, 'error')
    }, () => this.loader = false);
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

  color(row) {
    // if (row.bDeclinada == '1') {
    //   return {'background-color': '#FEC6C0'}
    // }
    // if (row.bValidada == '1') {
    //   return {'background-color': '#ABEBC6'}
    // }
    // return {'background-color': '#F9E79F'}
    return {'background-color': 'transparent'}
  }

  verificarEstatusSolicitud(element) {
    return this.vEstatusService.verificarEstatusSolicitud(element);
  }

  verificarDictamen(idDictamen, iEstatusGeneral) {
    return this.vEstatusService.verificarDictamen(idDictamen, iEstatusGeneral);  
  }

  verificarEstatusDictamen(bPublicarDictamen, iEstatusGeneral) {
    return this.vEstatusService.verificarEstatusDictamen(bPublicarDictamen, iEstatusGeneral);
  }

  reload() {
    this.ngOnInit();
  }

}
