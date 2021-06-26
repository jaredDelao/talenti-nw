import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'tiempoKpisCoordinador'
})
export class TiempoKpisCoordinadorPipe implements PipeTransform {

  transform(inicio: string, fin: string): any {
    if (!fin || !inicio) return 'Pendiente';
    return this.calcularTiempo(inicio, fin);
  }

  private calcularTiempo(date1, date2): string {
    if (!date1 || !date2) return '';
  
    let init = moment(date1);
    let final = moment(date2);
    
    let h = final.diff(init, 'hours', false);
    let m = final.diff(init, 'minutes', false);

    return `Horas: ${h}, Minutos: ${m}`;
  }
}
