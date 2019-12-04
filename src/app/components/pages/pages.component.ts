import { Component, ViewChild, OnInit } from "@angular/core";
import { MatDrawer } from "@angular/material";

const menu: Array<any> = [
  {
    titulo: "EJECUTIVO",
    list: [
      { title: "Solicitud de estudio", link: "solicitud-estudio" },
      { title: "Solicitud de cancelación", link: "solicitud-cancelacion" }
    ]
  },
  {
    titulo: "COORDINADOR",
    list: [
      { title: "Clientes", link: "clientes" },
      { title: "Empleados", link: "empleados" }
    ]
  },
  {
    titulo: "ANALISTA",
    list: [
      { title: "Nueva agenda", link: "nueva-agenda" },
      { title: "Cancelar solicitud", link: "cancelar-solicitud" }
    ]
  }
];

@Component({
  selector: "app-pages",
  templateUrl: "./pages.component.html",
  styleUrls: ["./pages.component.scss"]
})
export class PagesComponent implements OnInit {

  @ViewChild("drawer", { static: false }) menu: MatDrawer;
  menuList: Array<any> = menu;
  permiso: String = "analista";
  
  constructor() {}

  ngOnInit() {}
}
