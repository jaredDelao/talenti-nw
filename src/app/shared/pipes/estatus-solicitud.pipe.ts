import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estatusSolicitud'
})
export class EstatusSolicitudPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {    
    const { bDeclinada, bValidada, iEstatusGeneral } = value;
    if (iEstatusGeneral == '4') return 'CANCELADO';
    if (bDeclinada == '1') return 'DECLINADO';
    if (bValidada == '1') return 'VALIDADO';    
    return 'PENDIENTE';

  }

}
