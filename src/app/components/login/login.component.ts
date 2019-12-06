import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from "@angular/forms";
import { Router } from "@angular/router";
import { LoginService } from "../../services/login.service";

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

  // login() {
  //   this._loginService.login().subscribe(res => console.log(res));
  // }

  login() {
    localStorage.setItem('token', '21434234');
  }
}
