import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'verificarEstatusAplicacion'
})
export class VerificarEstatusAplicacionPipe implements PipeTransform {

  transform(iEstatusGeneral: any, bEstatusAsignacion: any): any {
    if (iEstatusGeneral == '4') return 'CANCELADO';
    if (!bEstatusAsignacion || bEstatusAsignacion == '0') return 'PENDIENTE'; 
    if (bEstatusAsignacion == '1') return 'EXITOSO'; 
  }

}
