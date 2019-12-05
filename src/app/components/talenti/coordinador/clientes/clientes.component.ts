import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator, MatTableDataSource } from "@angular/material";

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
export class ClientesComponent implements OnInit {
  displayedColumns: string[] = [
    "empresa",
    "usuario",
    "nombre",
    "ejecutivo",
    "editar"
  ];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor() {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }
}
