import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estatusDictamen'
})
export class EstatusDictamenPipe implements PipeTransform {

  transform(iEstatusGeneral: any, bPublicarDictamen: any): any {
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

}
