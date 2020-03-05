import { Component, OnInit } from "@angular/core";
import { EstudiosService } from '../../../../services/ejecutivo/estudios.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
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

  constructor(private fb: FormBuilder, public estudiosService: EstudiosService, public router: Router) {}

  ngOnInit() {
    this.formInit();
  }

  formInit() {
    this.form = this.fb.group({
      sService: new FormControl('SolicitarEstudio'),
      iIdCliente: new FormControl('1'),
      iIdEstudio: new FormControl({ id: null }, [Validators.required]),
      sFolio: new FormControl(''),
      bPreliminar: new FormControl(null, [Validators.required]),
      sComentarios: new FormControl(null, [Validators.required]),
      iIdAnalista: new FormControl('1'),
      sTokenCV: new FormControl(''),
      sNombres: new FormControl(null, [Validators.required]),
      sApellidos: new FormControl(null, [Validators.required]),
      sPuesto: new FormControl(null, [Validators.required]),
      sTelefono: new FormControl(null, [Validators.required]),
      sNss: new FormControl(null, [Validators.required]),
      sCurp: new FormControl(null, [Validators.required]),
      sCalleNumero: new FormControl(null, [Validators.required]),
      sColonia: new FormControl(null, [Validators.required]),
      sCp: new FormControl(null, [Validators.required]),
      sMunicipio: new FormControl(null, [Validators.required]),
      sEstado: new FormControl(null, [Validators.required])
    });
  }

  validar() {
    console.log(this.form.get("tipoEstudio").value);
  }

  enviar() {
    this.form.get('sFolio').setValue(Math.floor(Math.random()*10));
    let req = this.form.getRawValue();

    this.estudiosService.crearEstudio(req).subscribe((res: any) => {
      if (res.resultado == "Ok") {
        return Swal.fire('Registro exitoso', `Se ha registrado un nuevo estudio con folio ${req.sFolio}`, "success").then(r => {
          this.router.navigate(['ejecutivo/estudios']);
        })
      } else {
        return Swal.fire('Error', `Error al registrar Estudio`, "error");
      }
    }, err => {
      return Swal.fire('Error', `Error al registrar Estudio`, "error");
    })
  }
}
