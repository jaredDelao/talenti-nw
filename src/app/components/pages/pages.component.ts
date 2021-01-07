import { Component, ViewChild, OnInit, AfterContentInit, DoCheck } from "@angular/core";
import { MatDrawer } from "@angular/material";
import { Router } from '@angular/router';
import * as bcryptjs from 'bcryptjs';
import * as cryptoJS from 'crypto-js';
import Swal from 'sweetalert2';
import { EncriptarDesencriptarService } from 'src/app/services/encriptar-desencriptar.service';
import { ImagesService } from 'src/app/services/images.service';


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
      { title: "Estudios", link: "coordinador/estudios" },
      { title: "Clientes", link: "coordinador/clientes" },
      { title: "Empleados", link: "coordinador/empleados" },
      { title: "Empresas", link: "coordinador/empresas" },
    ]
  },
  {
    titulo: "LOGÍSTICA",
    list: [
      // { title: "Nueva agenda", link: "logistica/nueva-agenda" },
      // { title: "Cancelar solicitud", link: "logistica/cancelar-solicitud" }
      { title: "Estudios", link: "logistica/estudios-logistica" }
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
  },
  {
    titulo: "CALIDAD",
    list: [
      { title: "Estudios", link: "calidad/estudios-calidad" },
      // { title: "Solicitud de estudio", link: "cliente/solicitud-estudio" }
    ]
  }
];

const menuLogistica: Array<Object> = [
  {
    titulo: "LOGÍSTICA",
    list: [
      { title: "Estudios", link: "logistica/estudios-logistica" }
    ]
  }
];
const menuAnalista: Array<Object> = [
  {
    titulo: "ANALISTA",
    list: [
      { title: "Estudios", link: "analista/estudios" },
    ]
  }
];
const menuEjecutivo: Array<Object> = [
  {
    titulo: "EJECUTIVO",
    list: [
      { title: "Estudios", link: "ejecutivo/estudios" },
      { title: "Gráficas", link: "ejecutivo/grafica-ejecutivo" }
    ]
  },
];

const menuCalidad: Array<Object> = [
  {
    titulo: "CALIDAD",
    list: [
      { title: "Estudios", link: "calidad/estudios-calidad" },
      // { title: "Solicitud de cancelación", link: "ejecutivo/solicitud-cancelacion" }
    ]
  },
];

const menuCoordinador: Array<Object> = [
  {
    titulo: "COORDINADOR",
    list: [
      { title: "Estudios", link: "coordinador/estudios" },
      { title: "Clientes", link: "coordinador/clientes" },
      { title: "Empleados", link: "coordinador/empleados" },
      { title: "Empresas", link: "coordinador/empresas" },
    ]
  },
];

const menuCliente: Array<Object> = [
  {
      titulo: "CLIENTE",
      list: [
        { title: "Estudios", link: "cliente/estudios-cliente" },
        { title: "Gráfica", link: "cliente/grafica-cliente" }
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
  ulrImage: string;

  constructor(private router: Router, private cryptService: EncriptarDesencriptarService) { }

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

    if (localStorage.getItem('super'))
    this.cryptService.desencriptar(localStorage.getItem('super')).subscribe(console.log)
    // desencriptar
    // console.log(ci);
    

    let perfil = localStorage.getItem('perfil');
    let idPerfil = localStorage.getItem('idPerfil');
    let idEmpleado = localStorage.getItem('idEmpleado');
    let idCliente = localStorage.getItem('idCliente');

        
    bcryptjs.compare('Admin', perfil, (err, resultPerfil) => {
      idEmpleado !== 'cliente' && resultPerfil ? this.menuList = menuAdmin : '';
    })
    bcryptjs.compare('Ejecutivo', perfil, (err, res) => {
      res ? this.menuList = menuEjecutivo : '';
    });
    bcryptjs.compare('Analista', perfil, (err, res) => {
      res ? this.menuList = menuAnalista : '';
    });
    // Coordinador
    bcryptjs.compare('1', idPerfil, (err, res) => {
      res ? this.menuList = menuCoordinador : '';
    });
    // Supervisor logistica
    bcryptjs.compare('4', idPerfil, (err, res) => {
      res ? this.menuList = menuLogistica : '';
    });
    // Logistica ordinario
    bcryptjs.compare('8', idPerfil, (err, res) => {
      res ? this.menuList = menuLogistica : '';
    });
    // Calidad
    bcryptjs.compare('5', idPerfil, (err, res) => {
      res ? this.menuList = menuCalidad : '';
    });

    if (idCliente) {
      this.menuList = menuCliente;
    }

  }

  open() {
    this.menu.toggle();
  }

}
