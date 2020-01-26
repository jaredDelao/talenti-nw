import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from "@angular/forms";

const estudios: Array<Object> = [
  { id: 1, nombre: "Estudio socioeconómico laboral completo" },
  { id: 2, nombre: "Estudio socioeconómico laboral sin visa" },
  { id: 3, nombre: "Estudio socioeconómico laboral investigacion legal" },
  { id: 4, nombre: "Estudio socioeconómico laboral investigacion financiera" },
  {
    id: 5,
    nombre: "Estudio socioeconómico laboral investigacion legal y financiera"
  },
  { id: 6, nombre: "Investigación laboral" },
  { id: 7, nombre: "Validación domiciliaria" },
  { id: 8, nombre: "Investigación legal" },
  { id: 9, nombre: "Investigación financiera" },
  { id: 10, nombre: "Socioeconómica beca" },
  { id: 11, nombre: "Estudio socioeconómico financiero" },
  { id: 12, nombre: "Especial" }
];

@Component({
  selector: "app-solicitar-estudio",
  templateUrl: "./solicitar-estudio.component.html",
  styleUrls: ["./solicitar-estudio.component.scss"]
})
export class SolicitarEstudioComponent implements OnInit {
  public estudiosData: Array<Object> = estudios;
  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.formInit();
  }

  formInit() {
    this.form = this.fb.group({
      tipoEstudio: new FormControl({ id: null }, [Validators.required]),
      folio: new FormControl(null),
      preliminar: new FormControl(null, [Validators.required]),
      comentarios: new FormControl(null, [Validators.required]),
      analista: new FormControl(null, [Validators.required]),
      archivo: new FormControl(null),
      nombre: new FormControl(null, [Validators.required]),
      apellidos: new FormControl(null, [Validators.required]),
      puesto: new FormControl(null, [Validators.required]),
      telefono: new FormControl(null, [Validators.required]),
      nss: new FormControl(null, [Validators.required]),
      curp: new FormControl(null, [Validators.required]),
      calle: new FormControl(null, [Validators.required]),
      colonia: new FormControl(null, [Validators.required]),
      cp: new FormControl(null, [Validators.required]),
      municipio: new FormControl(null, [Validators.required]),
      estado: new FormControl(null, [Validators.required])
    });
  }

  validar() {
    console.log(this.form.get("tipoEstudio").value);
  }
}
