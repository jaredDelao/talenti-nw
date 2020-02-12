import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material";
import { EmpleadosService } from "src/app/services/coordinador/empleados.service";

import { map } from "rxjs/operators";
import { Empleados, Empleado } from "src/app/interfaces/talenti/coordinador/empleados";
import { Router } from '@angular/router';


@Component({
  selector: "app-empleados",
  templateUrl: "./empleados.component.html",
  styleUrls: ["./empleados.component.scss"]
})
export class EmpleadosComponent implements OnInit {
  displayedColumns: string[] = [ "puesto", "nombre", "apellidos", "editar"];
  dataSource;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(public empleadosService: EmpleadosService, private router: Router) {}

  ngOnInit() {
    
    this.getEmpleados();
  }

  getEmpleados() {
    this.empleadosService
      .getEmpleados()
      .pipe(map((empleado: Empleados) => empleado.Empleados))
      .subscribe((empleados: Array<Empleado>) => {
        this.dataSource = new MatTableDataSource(empleados)
        this.dataSource.paginator = this.paginator;        
      });
  }

  registrar() {
    this.empleadosService.idTipo.next(1);
    this.router.navigate(['/coordinador/empleados/registro-empleado']);
  }

  editar(id) {
    this.empleadosService.idTipo.next(2);
    this.router.navigate(['/coordinador/empleados/editar-empleado', id]);
  }
}
