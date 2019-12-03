import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: "app-registro-empleado",
  templateUrl: "./registro-empleado.component.html",
  styleUrls: ["./registro-empleado.component.scss"]
})
export class RegistroEmpleadoComponent implements OnInit {

  form: FormGroup;
  idEmpleado: any;

  constructor(private fb: FormBuilder, private _route: ActivatedRoute) {}

  ngOnInit() {
    this.idEmpleado = this._route.snapshot.paramMap.get('id');
    this.formInit();
  }

  formInit() {
    this.form = this.fb.group({
      nombre: new FormControl(null, [Validators.required]),
      apellidos: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
      usuario: new FormControl(null, [Validators.required]),
      empleado: new FormControl(null, [Validators.required])
    });
  }
}
