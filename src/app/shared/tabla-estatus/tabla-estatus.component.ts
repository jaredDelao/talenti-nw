import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { EmpleadosService } from 'src/app/services/coordinador/empleados.service';
import { pluck, catchError } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';
import { clienteNormal, clienteGNP } from '../../shared/docs/tiposDictamen';


@Component({
  selector: 'app-tabla-estatus',
  templateUrl: './tabla-estatus.component.html',
  styleUrls: ['./tabla-estatus.component.scss']
})
export class TablaEstatusComponent implements OnInit, OnDestroy {

  @Input() columnas: any[] = ['estatus_solicitud', 'estatus_asignacion', 'estatus_agenda', 'estatus_aplicacion', 'estatus_dictamen', 'dictamen'];
  @Input() data: any;
  @Input() titulo: string;
  @Input() tipoEstudio: string;
  @Input() analista: boolean = false;
  

  displayedColumns: Array<string> = [];
  dataSource: any;

  estatusGeneral: any;
  loader: boolean = false;

  // Catalogos
  catEmpleados: any;
  estatusDictamenList: any[] = [...clienteNormal, ...clienteGNP];

  empleadosSubs = new Subscription();

  constructor(public empleadosService: EmpleadosService) { }

  ngOnInit() {
    this.getEmpleados();    
  }

  ngOnDestroy() {
    this.empleadosSubs.unsubscribe();
  }
  
  tableInit() {
    this.displayedColumns = this.columnas;
    this.dataSource = this.data;
  }

  getEmpleados() {
    this.empleadosSubs = this.empleadosService.getEmpleados().pipe(
      pluck('Empleados'),
      catchError((err) => of([]))
    )
    .subscribe((resp) => {
      this.catEmpleados = resp;
      this.tableInit();
    }, (err) => {}, () => {
    })
  }

  estatusSolicitud(bValidada, bDeclinada, iEstatusGeneral) {
    if (iEstatusGeneral == '4') return 'CANCELADA';
    if (bDeclinada == '1') return 'DECLINADA';
    if ((bDeclinada && bValidada) == '0') return 'PENDIENTE';
    if (bValidada == '1') return 'VALIDADO';
  }

  estatusAsignacionLogistica(iIdEmpleadoLogistica) {
    if (this.tipoEstudio == '2') return 'N/A';
    if (iIdEmpleadoLogistica == '0' || !iIdEmpleadoLogistica) return 'SIN ASIGNAR';
    if (iIdEmpleadoLogistica) {
      const empleado = this.catEmpleados.find((value) => value.iIdEmpleado == iIdEmpleadoLogistica);
      if (empleado) {
        return empleado.sNombres + ' ' + empleado.sApellidos;
      } else {
        return 'Sin asignar'
      }
    }
  }

  estatusAgenda(iContadoAgendas, bAgendaRealizada, iEstatusGeneral) {
    if (this.tipoEstudio == '2') return 'N/A';
    if (iEstatusGeneral == '4') return 'CANCELADO';
    if (iContadoAgendas == '0') return 'PENDIENTE';
    if (iContadoAgendas == '1') return 'AGENDADO';
    if (iContadoAgendas > '1') return 'REAGENDADO';
  }

  estatusAplicacionToAnalista(bEstatusAsignacion) {
    if (this.tipoEstudio == '2') return 'N/A';
    if (!bEstatusAsignacion || bEstatusAsignacion == '0') return 'PENDIENTE';
    if (bEstatusAsignacion == '1') return 'EXITOSO';
  }

  estatusDictamen(bPublicarDictamen, iEstatusGeneral) {    
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

  dictamen(iEstatusDictamen) {
    if (!iEstatusDictamen) return 'PENDIENTE';
    if (iEstatusDictamen) {
      let dictamen = this.estatusDictamenList.find((dictamen) => dictamen.id == iEstatusDictamen);
      return dictamen.nombre;
    }
  }

  estatusPreliminar(iPublicarPreliminar, iEstatusGeneral) {
    if (iPublicarPreliminar == '0' || !iPublicarPreliminar) return 'N/A';
    if (iEstatusGeneral == '4') return 'CANCELADO';
    if (iPublicarPreliminar == '1') return 'PENDIENTE';
    if (iPublicarPreliminar == '2') return 'REVISIÓN';
    if (iPublicarPreliminar == '3') return 'PUBLICADO';
    if (iPublicarPreliminar == '4') return 'REBOTADO';
  }

}
