import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { EmpleadosService } from "src/app/services/coordinador/empleados.service";
import { map, flatMap, filter } from "rxjs/operators";
import { Perfiles, Perfil} from "src/app/interfaces/talenti/coordinador/perfiles";
import Swal from "sweetalert2";
import { Subscription, fromEvent } from 'rxjs';
import { Md5 } from 'ts-md5/dist/md5';

@Component({
  selector: "app-registro-empleado",
  templateUrl: "./registro-empleado.component.html",
  styleUrls: ["./registro-empleado.component.scss"]
})
export class RegistroEmpleadoComponent implements OnInit, OnDestroy {
  form: FormGroup;
  idEmpleado: any;
  idTipo: any;
  catalogoPerfiles: any[] = [];
  empleadosSubscription: Subscription = new Subscription();

  originalPassword: string;
  passwordChanged: boolean = false;
  loader: boolean = false;

  @ViewChild('password', {static: false}) inputPassword: ElementRef<any>;

  constructor(
    private fb: FormBuilder,
    private _route: ActivatedRoute,
    public empleadosService: EmpleadosService,
    public router: Router
  ) {}

  ngOnInit() {
    this.idEmpleado = this._route.snapshot.paramMap.get("id");
    this.formInit();
    this.getPerfiles();
    this.empleadosService.$idTipo.subscribe( id => this.idTipo = id);
    this.redirect();

    if (this.idTipo == 2) this.getEmpleadoById();
  
  }

  ngAfterViewInit() {

    if (this.idTipo == 2 && this.idEmpleado) {
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

  ngOnDestroy() {
    this.empleadosSubscription.unsubscribe();
  }

  redirect() {
    if (this.idTipo == 0) {
      this.router.navigate(['/coordinador/empleados/']);
    }
  }

  formInit() {
    this.form = this.fb.group({
      sService: new FormControl(''),
      nombres: new FormControl(null, [Validators.required]),
      apellidos: new FormControl(null, [Validators.required]),
      correoelectronico: new FormControl(null, [Validators.required, Validators.email]),
      md5pass: new FormControl(null, [Validators.required]),
      iIdEmpleado: new FormControl(null),
      iIdRol: new FormControl(null, [Validators.required])
    });
  }

  getPerfiles() {
    this.empleadosSubscription = this.empleadosService.getPerfiles().pipe(
      map((r: Perfiles) => r.Perfiles),
      flatMap(r => r),
      filter((v:any) => v.sTipo == 'e')
      ).subscribe(perfiles => this.catalogoPerfiles.push(perfiles));
  }

  // idTipo == 2
  getEmpleadoById() {
    let body = {sService: 'GetEmpleadobyId', iIdEmpleado: this.idEmpleado};
    this.loader = true;
    this.empleadosService.getEmpleadoById(body).subscribe((empleado: any) => {
      
      if (empleado.status !== 'Ok') {
        this.loader = false;
        return Swal.fire('Error', 'Error al consultar el empleado', 'error').then(r => {
          this.router.navigate(['/coordinador/empleados']);
        });
      }

      let res = empleado.Datos[0];
      const {iIdEmpleado, sNombres, sApellidos, iIdRol, sPassword, sCorreo} = res;
      this.originalPassword = sPassword;
      this.form.setValue({
        sService: 'UpdEmpleado',
        nombres: sNombres,
        apellidos: sApellidos,
        correoelectronico: sCorreo,
        md5pass: sPassword,
        iIdRol: iIdRol,
        iIdEmpleado: this.idEmpleado
      });
      this.loader = false;
    }, (err) => {
      this.loader = false;
      return Swal.fire('Error', 'Error al consultar el empleado', 'error');
    })
  }

  guardar() {

    let pass = this.form.controls['md5pass'].value;
    pass = Md5.hashStr(pass);
    
    // Registrar empleado 
    if (this.idTipo != 2) {
      this.form.controls['sService'].setValue('registroempleado');
      let req = this.form.getRawValue();
      req.md5pass = pass;
      
      this.empleadosService.registroEmpleado(req).subscribe((res: any) => {
        const { resultado } = res;
        if (resultado == "Ok") {
          return Swal.fire("Registro exitoso", `Usuario con correo ${req.correoelectronico} ha sido registrado`, "success").then(r => {
            this.router.navigate(['/coordinador/empleados']);
          });
        }

        return Swal.fire("Error al registrar empleado", 'Revisa que los campos sean correctos', 'error');

      });
    }


    // idTipo 2 - Editar
    if (this.idTipo == 2) {
      let body = this.form.getRawValue();
      
      if (body.md5pass && this.passwordChanged) body.md5pass = Md5.hashStr(body.md5pass);

      this.empleadosService.updateEmpleado(body).subscribe((res: any) => {
        
        const { resultado } = res;
        if (resultado == "Ok") {
          return Swal.fire("Registro exitoso", `Empleado con correo ${body.correoelectronico} ha sido registrado`, "success").then(r => {
            this.router.navigate(['/coordinador/empleados']);
          });
        }
      }, (err) => {
        return Swal.fire("Error al registra empleado", `El empleado con correo ${body.correoelectronico} no se pudo registrar`, "error").then(r => {
          this.router.navigate(['/coordinador/empleados']);
        });
        
      });

    }
    
  }
}
