import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'verificarEstatusAgenda'
})
export class VerificarEstatusAgendaPipe implements PipeTransform {

  transform(iContadoAgendas: any): any {
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

}
