import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'verificarDictamen'
})
export class VerificarDictamenPipe implements PipeTransform {

  transform(idDictamen: any, iEstatusGeneral: any, estatusDictamenList): any {
    if (iEstatusGeneral == '4') return '-'
    if (!idDictamen || idDictamen == '0') return 'PENDIENTE';    
    if (idDictamen > '0') {
      let dictamen = estatusDictamenList.find((dictamen) => dictamen.id == idDictamen);
      return dictamen.nombre;
    }    
  }

}
