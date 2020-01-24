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
      const { token, perfil, idPerfil, status }:any = res;
      if (token) {
        localStorage.setItem('token', token);
      }
      if (perfil && idPerfil) {
        bcryptjs.hash(perfil, 10, (err, res) => {
          if (err) console.log('No se pudo encriptar el perfil', err);
          console.log(res);
        })
      }

    });
  }
}
