import { Injectable } from '@angular/core';
import { clienteNormal, clienteGNP } from '../shared/docs/tiposDictamen';

@Injectable({
  providedIn: 'root'
})
export class VerificarEstatusService {

  estatusDictamenList = [...clienteNormal, ...clienteGNP];
  catEmpleados: any;

  constructor() { }

  verificarEstatusSolicitud(element) {
    const { bDeclinada, bValidada, iEstatusGeneral } = element;
    if (iEstatusGeneral == '4') return 'CANCELADO';
    if (bDeclinada == '1') return 'DECLINADO';
    if (bValidada == '1') return 'VALIDADO';    
    return 'PENDIENTE';
  }

  verificarDictamen(idDictamen, iEstatusGeneral) {
    if (iEstatusGeneral == '4') return '-'
    if (!idDictamen || idDictamen == '0') return 'PENDIENTE';    
    if (idDictamen > '0') {
      let dictamen = this.estatusDictamenList.find((dictamen) => dictamen.id == idDictamen);
      return dictamen.nombre;
    }    
  }

  verificarEstatusDictamen(bPublicarDictamen, iEstatusGeneral) {
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

  verificarPreliminar(iPublicarPreliminar) {
    switch(iPublicarPreliminar) {
      case '0':
        return 'N/A';
      case '1':
        return 'PENDIENTE';
      case '2':
        return 'REVISIÓN'
      case '3':
        return 'PUBLICADO';
      case '4':
        return 'REBOTADO';
    }
  }

  verificarEstatusAgenda(iContadoAgendas) {
    switch(iContadoAgendas) {
      case '0':
        return 'PENDIENTE'
      case '1':
        return 'AGENDADO'
      case '2':
        return 'REAGENDADO'
      case '3':
        return 'REAGENDADO'
      case '4':
        return 'CANCELADO'

      default:
        return '-'
    } 
  }

  verificarEstatusAplicacion(bEstatusAsignacion, iEstatusGeneral) {
    if (iEstatusGeneral == '4') return 'CANCELADO';
    if (!bEstatusAsignacion || bEstatusAsignacion == '0') return 'PENDIENTE'; 
    if (bEstatusAsignacion == '1') return 'EXITOSO'; 
  }
}
