import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { MatPaginator, MatTableDataSource } from "@angular/material";
import { ClientesService } from 'src/app/services/coordinador/clientes.service';
import { Clientes, ClientesList } from 'src/app/interfaces/talenti/coordinador/clientes';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { TipoEmpresa } from 'src/app/interfaces/talenti/coordinador/empresas';

const ELEMENT_DATA = [
  {
    id: 1,
    puesto: "Hydrogen",
    nombre: "Hydrogen",
    apellidos: "Hydrogen",
    correo: "Hydrogen"
  },
  {
    id: 2,
    puesto: "Helium",
    nombre: "Helium",
    apellidos: "Helium",
    correo: "Helium"
  },
  {
    id: 3,
    puesto: "Lithium",
    nombre: "Lithium",
    apellidos: "Lithium",
    correo: "Lithium"
  },
  {
    id: 4,
    puesto: "Beryllium",
    nombre: "Beryllium",
    apellidos: "Beryllium",
    correo: "Beryllium"
  },
  {
    id: 5,
    puesto: "Boron",
    nombre: "Boron",
    apellidos: "Boron",
    correo: "Boron"
  }
];

@Component({
  selector: "app-clientes",
  templateUrl: "./clientes.component.html",
  styleUrls: ["./clientes.component.scss"]
})
export class ClientesComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ["usuario", "nombre", "editar"];
  dataSource;
  listaEmpresas: Array<TipoEmpresa>;
  subscription: Subscription;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private clientesService: ClientesService, private router: Router) {}

  ngOnInit() {
    this.getClientes();
  }

  getClientes() {
    this.subscription = this.clientesService.getClientes().pipe(
      map(clientes => clientes.Clientes)
    )
    .subscribe((clientesList) => {
      this.dataSource = new MatTableDataSource(clientesList);
      this.dataSource.paginator = this.paginator;
    })
  }

  crear() {
    this.clientesService.idTipoSubject.next(1);
    this.router.navigate(['/coordinador/clientes/registro-cliente']);
  }

  editar(id) {
    this.clientesService.idTipoSubject.next(2);
    this.router.navigate(['/coordinador/clientes/editar-cliente', id]);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
