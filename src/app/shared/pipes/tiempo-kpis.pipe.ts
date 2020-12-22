import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { Kpis, TipoKpi } from 'src/app/models/kpis.model';

@Pipe({
  name: 'tiempoKpis',
})
export class TiempoKpisPipe implements PipeTransform {

  transform(el: Kpis, data: Kpis[], str?: string): string | number {


    if (!str) {
      // let y = data.find((x) => x.iEstatusGeneral == el.iEstatusGeneral);
      if (!el) return '';
      if (!data) return '';
  
      if (Number(el.iEstatusGeneral) == TipoKpi.CREACION) {
        let final = data.find((c) => Number(c.iEstatusGeneral) == TipoKpi.VALIDACION);
        console.log(final);
        
        return this.calcularTiempo(el.dFechaRegistro, final.dFechaRegistro);
      }
  
      if (Number(el.iEstatusGeneral) == TipoKpi.VALIDACION) {
        let final = data.find((c) => Number(c.iEstatusGeneral) == TipoKpi.ASIGNACION);
        return this.calcularTiempo(el.dFechaRegistro, final.dFechaRegistro);
      }
  
      if (Number(el.iEstatusGeneral) == TipoKpi.ASIGNACION) {
        let final = data.find((c) => Number(c.iEstatusGeneral) == TipoKpi.AGENDA);
        return this.calcularTiempo(el.dFechaRegistro, final.dFechaRegistro);
      }
  
      if (Number(el.iEstatusGeneral) == TipoKpi.AGENDA) {
        let final = data.find((c) => Number(c.iEstatusGeneral) == TipoKpi.APLICACION);
        return this.calcularTiempo(el.dFechaRegistro, final.dFechaRegistro);
      }
  
      if (Number(el.iEstatusGeneral) == TipoKpi.APLICACION) {
        let final = data.find((c) => Number(c.iEstatusGeneral) == TipoKpi.ARCHIVOS);
        return this.calcularTiempo(el.dFechaRegistro, final.dFechaRegistro);
      }
  
      if (Number(el.iEstatusGeneral) == TipoKpi.ARCHIVOS) {
        let final = data.find((c) => Number(c.iEstatusGeneral) == TipoKpi.PUBLICACION);
        return this.calcularTiempo(el.dFechaRegistro, final.dFechaRegistro);
      }
  
      if (Number(el.iEstatusGeneral) == TipoKpi.PUBLICACION) {
        return 'Fin de proceso';
      }
    }

    else {


      if (Number(el.iEstatusGeneral) == TipoKpi.CREACION) {        
        return 'Creación - Validación';
      }
  
      if (Number(el.iEstatusGeneral) == TipoKpi.VALIDACION) {
        return 'Validación - Asignación';

      }
  
      if (Number(el.iEstatusGeneral) == TipoKpi.ASIGNACION) {
        return 'Asignación - Agenda';

      }
  
      if (Number(el.iEstatusGeneral) == TipoKpi.AGENDA) {
        return 'Agenda - Aplicación';

      }
  
      if (Number(el.iEstatusGeneral) == TipoKpi.APLICACION) {
        return 'Aplicación - Archivos dictamen';

      }
  
      if (Number(el.iEstatusGeneral) == TipoKpi.ARCHIVOS) {
        return 'Archivos dictamen - Publicación';

      }
  
      if (Number(el.iEstatusGeneral) == TipoKpi.PUBLICACION) {
        return '-';
      }


    }

  }
  
  calcularTiempo(date1, date2) {
    if (!date1 || !date2) return '';
  
    var init = moment(date1);
    var final = moment(date2);
    
    let h = final.diff(init, 'hours', false);
    let m = final.diff(init, 'minutes', false);

    return `Horas: ${h}, Minutos: ${m}`;






  }

}
