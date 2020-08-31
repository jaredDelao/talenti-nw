import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'verificarPreliminar'
})
export class VerificarPreliminarPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    switch(value) {
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

}
