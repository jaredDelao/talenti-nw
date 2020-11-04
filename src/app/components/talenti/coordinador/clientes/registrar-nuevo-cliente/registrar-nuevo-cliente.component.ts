import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ClientesService } from "src/app/services/coordinador/clientes.service";
import { TipoEmpresa } from "src/app/interfaces/talenti/coordinador/empresas";
import { Ejecutivo } from "src/app/interfaces/talenti/coordinador/ejecutivos";
import { Perfiles } from "src/app/interfaces/talenti/coordinador/perfiles";
import { map, filter, flatMap } from "rxjs/operators";
import Swal from 'sweetalert2';
import { Md5 } from 'ts-md5/dist/md5';
import { fromEvent } from 'rxjs';

@Component({
  selector: "app-registrar-nuevo-cliente",
  templateUrl: "./registrar-nuevo-cliente.component.html",
  styleUrls: ["./registrar-nuevo-cliente.component.scss"]
})
export class RegistrarNuevoClienteComponent implements OnInit, AfterViewInit {
  form: FormGroup;
  idCliente: any;
  idTipo: number;
  tipoUsuariosList: any[] = [];


  originalPassword: string;
  passwordChanged: boolean = false;
  loader: boolean = false;

  // Catálogos
  listaTipoUsuarios: Array<Perfiles>;
  listaEmpresas: Array<TipoEmpresa>;
  listaEjecutivos: Array<Ejecutivo>;

  @ViewChild('password', {static: false}) inputPassword: ElementRef<any>;
  

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

    if (this.idTipo == 2 && this.idCliente) {
      this.getClienteById();
    }
  }

  ngAfterViewInit() {

    if (this.idTipo == 2 && this.idCliente) {
      const passChanged = fromEvent<any>(this.inputPassword.nativeElement, 'input');
      passChanged.subscribe(r => {
        if (!this.passwordChanged) this.onchangePassword()
      })
    }

  }

  onchangePassword() { 
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-primary ml-2',
        cancelButton: 'btn btn-danger mr-2'
      },
      buttonsStyling: false
    })
    
    swalWithBootstrapButtons.fire({
      title: 'Editar contraseña',
      text: "¿Estás seguro que deseas modificar la contraseña?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, editar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.passwordChanged = true;
      } else if (
        /* Calcel option */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        this.passwordChanged = false;
        this.form.controls['md5pass'].setValue(this.originalPassword);        
      }
    })
  }

  // Form
  formInit() {
    this.form = this.fb.group({
      sService: new FormControl(''),
      nombres: new FormControl(null, [Validators.required]),
      apellidos: new FormControl(null, [Validators.required]),
      correoelectronico: new FormControl(null, [Validators.required, Validators.email]),
      md5pass: new FormControl(null, [Validators.required]),
      iIdRol: new FormControl(null, [Validators.required]),
      iIdEmpresa: new FormControl(null, [Validators.required]),
      idejecutivo: new FormControl(null, [Validators.required]),
      iIdCliente: new FormControl(null)
    });
  }

  // Tipo cliente - privilegios
  getTipoUsuarios() {
    this.clientesService.getTipoUsuario().pipe(
      flatMap(r => r),
      filter((v: any) => v.sTipo == 'c')
    )
    .subscribe(tipos => {
      this.tipoUsuariosList.push(tipos);
    });
  }

  // idTipo = 2
  getClienteById() {
    let body = {sService: 'GetClientesbyId', iIdCliente: this.idCliente};
    this.loader = true;
    
    this.clientesService.getClienteById(body).subscribe((cliente: any) => {
      if (cliente.status !== 'Ok') {
        this.loader = false;
        return Swal.fire('Error', 'Error al consultar el cliente', 'error').then(r => {
          this.router.navigate(['/coordinador/clientes']);
        });
      }

      let res = cliente.Datos[0];

      if (res) {
        
        const { sNombres, sApellidos, iIdRol, sPassword, iIdEmpresa, iIdEjecutivo, sCorreo} = res;
        this.originalPassword = sPassword;
        // console.log(res);
        this.form.setValue({
          sService: 'UpdCliente',
          nombres: sNombres,
          apellidos: sApellidos,
          correoelectronico: sCorreo,
          md5pass: sPassword,
          iIdRol: iIdRol,
          iIdEmpresa,
          idejecutivo: iIdEjecutivo,
          iIdCliente: this.idCliente
        });
        this.loader = false;
      } else {
        this.loader = false; 
        Swal.fire('Error', 'No se pudo cargar el cliente', 'error').then(v => this.router.navigate(['/coordinador/clientes']))
      }
      
    }, (err) => {
      this.loader = false; 
      Swal.fire('Error', 'No se pudo cargar el cliente', 'error').then(v => this.router.navigate(['/coordinador/clientes']))
    });
  }

  getEmpresas() {
    this.clientesService
      .getEmpresas()
      .pipe(map(empresas => empresas.Empresas))
      .subscribe(empresas => {
        this.listaEmpresas = empresas;
      });
  }

  getEjecutivos() {
    this.clientesService
      .getEjecutivos()
      .pipe(map(ejecutivos => ejecutivos.Empleados))
      .subscribe((ejecutivos: Array<Ejecutivo>) => {
        this.listaEjecutivos = ejecutivos;
      });
  }

  guardar() {
    
    
    // idTipo 1 - Guardar
    if (this.idTipo == 1) {
    this.form.controls['sService'].setValue('registrocliente');
    let body = this.form.getRawValue();
    body.md5pass = Md5.hashStr(body.md5pass);

    this.clientesService.registroCliente(body).subscribe((cliente: any) => {
      if (cliente.resultado == 'Ok') {
        return Swal.fire('Cliente registrado exitosamente', '', 'success').then(value => {
          this.router.navigate(['/coordinador/clientes']);
        })
      }
      return Swal.fire('Error al registrar cliente', '', 'error');
    });

    }

    // idTipo 2 - Editar
    if (this.idTipo == 2) {
      // this.form.setControl('iIdCliente', this.idCliente);
      let body = this.form.getRawValue();
      if (body.md5pass && this.passwordChanged) body.md5pass = Md5.hashStr(body.md5pass);

      console.log(body);
      
      this.clientesService.updateCliente(body).subscribe((res: any) => {
        const { resultado } = res;
        if (resultado == "Ok") {
          return Swal.fire("Registro actualizado", `Cliente con correo ${body.correoelectronico} ha sido actualizado`, "success").then(r => {
            this.router.navigate(['/coordinador/clientes']);
          });
        }
        console.log(res);
      })

    }
    

    
  }

}
