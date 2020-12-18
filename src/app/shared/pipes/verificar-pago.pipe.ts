import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'verificarPago'
})
export class VerificarPagoPipe implements PipeTransform {

  transform(value: any): any {

    /**@param dCosto1 = costo normal */
    /**@param dCosto2 = costo por cancelación */

    const { bDeclinada, bValidada, iEstatusGeneral, dCosto1, dCosto2 } = value;

    if (iEstatusGeneral == '4') return dCosto2;
    else return dCosto1
   
  }

}
