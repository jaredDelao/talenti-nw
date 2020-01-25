import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, Validators} from "@angular/forms";
import { Router } from "@angular/router";
import { LoginService } from "../../services/login.service";
import * as bcryptjs from 'bcryptjs';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  usuario: any = {
    user: "",
    password: "",
    recordar: false
  };

  constructor(
    private _router: Router,
    private fb: FormBuilder,
    private _loginService: LoginService
  ) {}

  ngOnInit() {
    this.formInit();
  }

  formInit() {
    this.form = this.fb.group({
      user: new FormControl("", [Validators.required, Validators.minLength(3)]),
      password: new FormControl("", [Validators.required]),
      recordar: new FormControl(false)
    });
  }

  login() {
    this._loginService.login().subscribe(res => {
      console.log(res);
      const { token, perfil, idPerfil, status, Nombre }:any = res;

      // Token
      if (token) {
        localStorage.setItem('token', token);
      }
      // Nombre
      if (Nombre) {
        localStorage.setItem('nombre', Nombre);
      }
      // Perfil
      if (perfil) {
        bcryptjs.hash(perfil, 10, (err, cryptPerfil) => {
          if (err) console.error('No se pudo encriptar el perfil', err);
          localStorage.setItem('perfil', cryptPerfil);
        });
      }
      // idPerfil
      if (idPerfil) {
        bcryptjs.hash(idPerfil, 10, (err, cryptIdPerfil) => {
          if (err) console.error('No se pudo encriptar el idPerfil', err);
          localStorage.setItem('idPerfil', cryptIdPerfil);
        });
      }

      this._router.navigate(['/dashboard'])

    });
  }
}
