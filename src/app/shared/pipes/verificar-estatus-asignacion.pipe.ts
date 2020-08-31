import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'verificarEstatusAsignacion'
})
export class VerificarEstatusAsignacionPipe implements PipeTransform {

  transform(iIdEmpleadoLogistica: any, catEmpleados: any[]): any {
    if (!iIdEmpleadoLogistica) return 'SIN ASIGNAR'
    const empleadoLogistica = catEmpleados.find((value) => value.iIdEmpleado == iIdEmpleadoLogistica);
    return empleadoLogistica.sNombres + ' ' + empleadoLogistica.sApellidos;
  }

}
