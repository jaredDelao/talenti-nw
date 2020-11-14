import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'verificarCliente'
})
export class VerificarClientePipe implements PipeTransform {

  transform(id: number, catClientes: any[]): any {    

    if (catClientes) {
      if (catClientes.length > 0) {
  
        let empresa = catClientes.find((x) => x.iIdEmpresa == id);
        if (empresa) {
          return empresa.sNombreEmpresa;
        }
        return null;
        
      }
    }

    return null;
  }

}
