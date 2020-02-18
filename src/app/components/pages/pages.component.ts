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
      { title: "Solicitud de cancelación", link: "ejecutivo/solicitud-cancelacion" }
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
    titulo: "ANALISTA",
    list: [
      { title: "Nueva agenda", link: "analista/nueva-agenda" },
      { title: "Cancelar solicitud", link: "analista/cancelar-solicitud" }
    ]
  }
];

const menuEjecutivo: Array<Object> = [
  {
    titulo: "EJECUTIVO",
    list: [
      { title: "Estudios", link: "ejecutivo/estudios" },
      { title: "Solicitud de cancelación", link: "ejecutivo/solicitud-cancelacion" }
    ]
  },
];

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
      ? this.colorT = 'white'
      : this.colorT = 'primary';
  }

  cerrarSesion() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  getLocalStorage() {
    let perfil = localStorage.getItem('perfil');
        
    bcryptjs.compare('Admin', perfil, (err, res) => {
      res ? this.menuList = menuAdmin : '';
    });
    bcryptjs.compare('Ejecutivo', perfil, (err, res) => {
      res ? this.menuList = menuEjecutivo : '';
    });

  }

  open() {
    this.menu.toggle();
  }

}
