import { Component, ViewChild, OnInit, AfterContentInit, DoCheck } from "@angular/core";
import { MatDrawer } from "@angular/material";
import { Router } from '@angular/router';
import * as bcryptjs from 'bcryptjs';
import Swal from 'sweetalert2';

// const menuEjecutivo: Array<Object>;

const menuAdmin: Array<Object> = [
  {
    titulo: "EJECUTIVO",
    list: [
      { title: "Estudios", link: "ejecutivo/estudios" },
      // { title: "Solicitud de cancelación", link: "ejecutivo/solicitud-cancelacion" }
    ]
  },
  {
    titulo: "COORDINADOR",
    list: [
      { title: "Clientes", link: "coordinador/clientes" },
      { title: "Empleados", link: "coordinador/empleados" },
      { title: "Empresas", link: "coordinador/empresas" },
    ]
  },
  {
    titulo: "LOGÍSTICA",
    list: [
      { title: "Nueva agenda", link: "logistica/nueva-agenda" },
      // { title: "Cancelar solicitud", link: "logistica/cancelar-solicitud" }
    ]
  },
  {
    titulo: "ANALISTA",
    list: [
      { title: "Estudios", link: "analista/estudios" },
      // { title: "Estudios", link: "analista/detalle-estudio" },
    ]
  },
  {
    titulo: "CLIENTE",
    list: [
      { title: "Estudios", link: "cliente/estudios-cliente" },
      // { title: "Solicitud de estudio", link: "cliente/solicitud-estudio" }
    ]
  }
];

const menuLogistica: Array<Object> = [
  {
    titulo: "LOGÍSTICA",
    list: [
      { title: "Nueva agenda", link: "logistica/nueva-agenda" },
      { title: "Cancelar solicitud", link: "logistica/cancelar-solicitud" }
    ]
  }
];
const menuAnalista: Array<Object> = [
  {
    titulo: "ANALISTA",
    list: [
      { title: "Estudios", link: "analista/detalle-estudio" },
    ]
  }
];
const menuEjecutivo: Array<Object> = [
  {
    titulo: "EJECUTIVO",
    list: [
      { title: "Estudios", link: "ejecutivo/estudios" },
      // { title: "Solicitud de cancelación", link: "ejecutivo/solicitud-cancelacion" }
    ]
  },
];

const menuCliente: Array<Object> = [
  {
      titulo: "CLIENTE",
      list: [
        { title: "Estudios", link: "cliente/estudios-cliente" },
        // { title: "Solicitud de estudio", link: "cliente/solicitud-estudio" }
      ]
  }
]

@Component({
  selector: "app-pages",
  templateUrl: "./pages.component.html",
  styleUrls: ["./pages.component.scss"]
})
export class PagesComponent implements OnInit, DoCheck {

  @ViewChild("drawer", { static: false }) menu: MatDrawer;
  menuList: Array<Object>;
  permiso: String = "analista";
  colorT: string = 'primary';

  constructor(private router: Router) { }

  ngOnInit() {
    this.getLocalStorage();
  }

  ngDoCheck() {
    this.router.url === '/dashboard'
      ? this.colorT = 'primary'
      : this.colorT = 'primary';
  }

  cerrarSesion() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  getLocalStorage() {
    let perfil = localStorage.getItem('perfil');
    let idEmpleado = localStorage.getItem('idEmpleado');
        
    bcryptjs.compare('Admin', perfil, (err, resultPerfil) => {
      idEmpleado !== 'cliente' && resultPerfil ? this.menuList = menuAdmin : this.menuList = menuCliente;
    })
    bcryptjs.compare('Ejecutivo', perfil, (err, res) => {
      res ? this.menuList = menuEjecutivo : '';
    });
    bcryptjs.compare('Analista', perfil, (err, res) => {
      res ? this.menuList = menuAnalista : '';
    });

  }

  open() {
    this.menu.toggle();
  }

}
