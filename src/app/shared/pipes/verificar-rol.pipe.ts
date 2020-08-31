import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'verificarRol'
})
export class VerificarRolPipe implements PipeTransform {

  transform(iEstatusGral: any, bPublicarDictamen: any, bDeclinada: any): any {    
    if (iEstatusGral != '4' && bPublicarDictamen && bDeclinada != '1') {

      switch(bPublicarDictamen) {
        case '0':
          return {'background-color': '#F9E79F'};
        case '1':
          return {'background-color': '#F9E79F'};
        case '2':
          return {'background-color': '#F9E79F'};
        default:
          return {'background-color': 'transparent'}
      }
    }
  }

}
