import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-registrar-nuevo-cliente',
  templateUrl: './registrar-nuevo-cliente.component.html',
  styleUrls: ['./registrar-nuevo-cliente.component.scss']
})
export class RegistrarNuevoClienteComponent implements OnInit {

  form: FormGroup;
  idCliente: any;

  constructor(private fb: FormBuilder, private _route: ActivatedRoute) { }

  ngOnInit() {
    this.idCliente = this._route.snapshot.paramMap.get('id');
    this.formInit();
    console.log(this.idCliente)
  }

  formInit() {
    this.form = this.fb.group({
      nombre: new FormControl(null, [Validators.required]),
      apellidos: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
      tipoCliente: new FormControl(null, [Validators.required]),
      empresa: new FormControl(null, [Validators.required]),
      ejecutivo: new FormControl(null, [Validators.required]),
    })
  }

  guardar() {
    console.log(this.form.getRawValue())
  }

}
