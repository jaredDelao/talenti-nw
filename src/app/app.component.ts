import { Component, ViewChild, OnInit } from '@angular/core';
import { MatDrawer } from '@angular/material';

const menu: Array<any> = [
  {
    titulo: "EJECUTIVO",
    list: [
      { title: "Estudios", link: "ejecutivo/solicitud-estudios" },
      { title: "Solicitud de estudio", link: "ejecutivo/solicitar-estudio" },
      { title: "Solicitud de cancelación", link: "ejecutivo/solicitud-cancelacion" }
    ]
  },
  {
    titulo: "COORDINADOR",
    list: [
      { title: "Clientes", link: "coordinador/clientes" },
      { title: "Empleados", link: "coordinador/empleados" },
      { title: "Empresas", link: "coordinador/empresas" },
      { title: "Registrar cliente", link: "coordinador/clientes/registro-cliente" },
      { title: "Registrar empresa", link: "coordinador/empresas/registro-empresa" },
      { title: "Registrar empleado", link: "coordinador/empleados/registro-empleado" },
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
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {

  @ViewChild('drawer', { static: false }) menu: MatDrawer;
  menuList: Array<any> = menu;

  permiso: String = 'analista';

  ngOnInit() {
    // if (this.permiso == 'analista') {
    //   this.menuList = menu.filter(el => {
    //     return el.titulo == 'ANALISTA';
    //   })
    // }
  }
  
}
