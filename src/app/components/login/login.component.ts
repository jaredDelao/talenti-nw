import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, Validators} from "@angular/forms";
import { Router } from "@angular/router";
import { LoginService } from "../../services/login.service";
import * as bcryptjs from 'bcryptjs';
import  Swal from 'sweetalert2';
import { Md5 } from 'ts-md5/dist/md5';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  
  form: FormGroup;
  loader: boolean = false;

  constructor(
    private _router: Router,
    private fb: FormBuilder,
    private _loginService: LoginService,
  ) {}

  ngOnInit() {
    this.formInit();
  }

  formInit() {
    this.form = this.fb.group({
      sService: new FormControl('login'),
      correo: new FormControl("", [Validators.required, Validators.email]),
      md5pass: new FormControl("", [Validators.required]),
    });
  }

  login() {
    // loader
    this.loader = true;

    // Crypt password
    let password = this.form.controls['md5pass'].value;
    let md5pass = Md5.hashStr(password);
    
    let req = this.form.getRawValue();
    req.md5pass = md5pass;
    
    this._loginService.login(req).subscribe(res => {
      console.log(res);
      const { token, perfil, idPerfil, resultado, Nombre, iIdEmpleado }:any = res;

      if (resultado == 'Error') {
        this.loader = false;
        return Swal.fire('Error','Usuario y/o password incorrectos','error');
      }

      // Token
      if (token) localStorage.setItem('token', token);
      // Nombre
      if (Nombre) localStorage.setItem('nombre', Nombre);
      // idEmpleado
      if (iIdEmpleado) localStorage.setItem('idEmpleado', iIdEmpleado);
      
      // Perfil & idPerfil
      if (perfil && idPerfil) {
        const perfilAsync = bcryptjs.hashSync(perfil, 10);
        const idPerfilAsync = bcryptjs.hashSync(idPerfil, 10);
        localStorage.setItem('perfil', perfilAsync)
        localStorage.setItem('idPerfil', idPerfilAsync);
        this.loader = false;
        return this._router.navigate(['/dashboard'])
      }
    }, (err) => {
      this.loader = false;
      Swal.fire('Error', err.message, 'error');
    });
  }
}
