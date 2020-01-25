import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ClientesService } from "src/app/services/coordinador/clientes.service";
import { TipoUsuario } from "src/app/interfaces/talenti/coordinador/tipo-usuario";
import { Perfiles } from "src/app/interfaces/talenti/coordinador/tipo-usuario";
import {
  Empresas,
  TipoEmpresa
} from "src/app/interfaces/talenti/coordinador/empresas";
import {
  Ejecutivos,
  Ejecutivo
} from "src/app/interfaces/talenti/coordinador/ejecutivos";

@Component({
  selector: "app-registrar-nuevo-cliente",
  templateUrl: "./registrar-nuevo-cliente.component.html",
  styleUrls: ["./registrar-nuevo-cliente.component.scss"]
})
export class RegistrarNuevoClienteComponent implements OnInit {
  form: FormGroup;
  idCliente: any;
  idTipo: number;

  // Catálogos
  listaTipoUsuarios: Array<Perfiles>;
  listaEmpresas: Array<TipoEmpresa>;
  listaEjecutivos: Array<Ejecutivo>;

  constructor(
    private fb: FormBuilder,
    private _route: ActivatedRoute,
    private clientesService: ClientesService,
    private router: Router
  ) {
    // this.idTipo = this.router.getCurrentNavigation().extras.state.id;
    // console.log(this.idTipo)
    this.clientesService.$idTipoSubject.subscribe(id => {
      this.idTipo = id;
      if (id == 0) {
        this.router.navigate(["/coordinador/clientes"]);
      }

      // search byId
      this.idCliente = this._route.snapshot.paramMap.get("id");
    });
  }

  ngOnInit() {
    this.formInit();
    this.getTipoUsuarios();
    this.getEmpresas();
    this.getEjecutivos();
  }

  formInit() {
    this.form = this.fb.group({
      nombre: new FormControl(null, [Validators.required]),
      apellidos: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
      tipoCliente: new FormControl(null, [Validators.required]),
      empresa: new FormControl(null, [Validators.required]),
      ejecutivo: new FormControl(null, [Validators.required])
    });
  }

  getTipoUsuarios() {
    this.clientesService.getTipoUsuario().subscribe(tipos => {
      this.listaTipoUsuarios = tipos.perfiles;
    });
  }

  getEmpresas() {
    this.clientesService.getEmpresas().subscribe((empresas: Empresas) => {
      this.listaEmpresas = empresas.empresas;
    });
  }

  getEjecutivos() {
    this.clientesService.getEjecutivos().subscribe((ejecutivos: Ejecutivos) => {
      this.listaEjecutivos = ejecutivos.ejecutivos;
    });
  }

  guardar() {
    console.log(this.form.getRawValue());
  }
}
