import { Component, ViewChild, OnInit } from "@angular/core";
import { MatDrawer } from "@angular/material";

const menu: Array<any> = [
  {
    titulo: "EJECUTIVO",
    list: [
      { title: "Solicitud de estudio", link: "ejecutivo/solicitud-estudios" },
      { title: "Solicitud de cancelación", link: "ejecutivo/solicitud-cancelacion" }
    ]
  },
  {
    titulo: "COORDINADOR",
    list: [
      { title: "Clientes", link: "coordinador/clientes" },
      { title: "Empleados", link: "coordinador/empleados" }
    ]
  },
  {
    titulo: "ANALISTA",
    list: [
      { title: "Nueva agenda", link: "analista/nueva-agenda" },
      { title: "Cancelar solicitud", link: "analista/cancelar-solicitud" }
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
