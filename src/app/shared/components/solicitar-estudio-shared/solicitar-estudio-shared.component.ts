import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from "@angular/forms";
import { EstudiosService } from 'src/app/services/ejecutivo/estudios.service';
import { EmpresasService } from 'src/app/services/coordinador/empresas.service';
import { EmpleadosService } from 'src/app/services/coordinador/empleados.service';
import { flatMap, tap, filter, pluck, toArray, catchError } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';


@Component({
  selector: 'app-solicitar-estudio-shared',
  templateUrl: './solicitar-estudio-shared.component.html',
  styleUrls: ['./solicitar-estudio-shared.component.scss']
})


export class SolicitarEstudioSharedComponent implements OnInit, OnDestroy {

  @Input() esCliente: boolean = false;
  @Input() analista: boolean = false;
  @Input() esGNP: boolean = true;
  @Input() dataEstudio: any = false;
  @Input() regresar: any = '';


  catAnalistas: any[] = [];
  idSolicitud: any;
  public estudiosData: Array<Object> = [];
  form: FormGroup;
  preliminarList = [
    {nombre: 'SI', value: true},
    {nombre: 'NO', value: false},
  ];

  subs = new Subscription();
  subs1 = new Subscription();
  subs2 = new Subscription();

  constructor(private fb: FormBuilder, public estudiosService: EstudiosService, public router: Router, public empresasService: EmpresasService, public empleadosService: EmpleadosService) {}

  ngOnInit() {
   
    this.formInit();
    // this.catAnalistas();
    if (this.dataEstudio) {this.setValue()};
    this.getCatalogoEstudios();
    this.consultaAnalista();
    this.getCatAnalistas();

  }

  ngOnDestroy() {
    this.subs.unsubscribe()
    this.subs1.unsubscribe()
    this.subs2.unsubscribe()
  }

  getCatAnalistas() {
   this.subs =  this.empleadosService.getEmpleados().pipe(
      pluck('Empleados'),
      flatMap((r: any) => r),
      filter((val: any) => val.iIdRol == 3),
      toArray(),
      catchError((err) => of([])))
    .subscribe((analistas: Array<any>) => {
      this.catAnalistas = analistas;
    })
  }

  consultaAnalista() {
    if (this.analista || this.dataEstudio) {
      this.form.disable();
    }
  }


  getCatalogoEstudios() {
    this.subs1 = this.empresasService.getCatalogoEstudios().subscribe((resp: any) => {
      this.estudiosData = resp.LstEstudios;
    })
  }

  formInit() {
    this.form = this.fb.group({
      sService: new FormControl('SolicitarEstudio'),
      iIdCliente: new FormControl('1'),
      iIdEstudio: new FormControl('', [Validators.required]),
      sFolio: new FormControl(''),
      analista: new FormControl(''),
      iPreliminar: new FormControl(),
      sComentarios: new FormControl('', [Validators.required]),
      iIdAnalista: new FormControl('1'),
      sTokenCV: new FormControl(''),
      sNombres: new FormControl('', [Validators.required]),
      sApellidos: new FormControl('', [Validators.required]),
      sPuesto: new FormControl('', [Validators.required]),
      sTelefono: new FormControl('', [Validators.required]),
      sNss: new FormControl('', [Validators.required]),
      sCurp: new FormControl('', [Validators.required]),
      sCalleNumero: new FormControl('', [Validators.required]),
      sColonia: new FormControl('', [Validators.required]),
      sCp: new FormControl('', [Validators.required]),
      sMunicipio: new FormControl('', [Validators.required]),
      sEstado: new FormControl('', [Validators.required])
    });
  }

  regresarFunc() {
    this.router.navigate([this.regresar]);
  }

  setValue() {
    const { iIdSolicitud, iIdCliente, iIdEstudio, 
      sFolio, bPreliminar, iIdAnalista, sComentarios, sNombres, sApellidos, sPuesto, 
      sTokenCV, sTelefono, sNss, sCurp, sCalleNumero, sColonia, sCp, sMunicipio, sEstado,
    } = this.dataEstudio;

    this.idSolicitud = iIdSolicitud;

    this.form.patchValue({
      iIdCliente,
      iIdEstudio: iIdEstudio,
      sFolio,
      bPreliminar,
      sComentarios,
      iIdAnalista,
      sTokenCV,
      sNombres,
      sApellidos,
      sPuesto,
      sTelefono,
      sNss,
      sCurp,
      sCalleNumero,
      sColonia,
      sCp,
      sMunicipio,
      sEstado,
    });
  } 

  validar() {
    console.log(this.form.get("tipoEstudio").value);
  }

  enviar(param, row) {
    this.form.get('sFolio').setValue(Math.floor(Math.random()*10));
    let req = this.form.getRawValue();
    let reqValidar = {
      sService: 'validarSolicitud',
      iIdSolicitud: this.idSolicitud
    }

    console.log(req);
    
    // CREAR Y VALIDAR - EJECUTIVO
    if (param == 'crearValidar') {
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

      // this.estudiosService.validarSolicitud(reqValidar).subscribe((res:any) => {
      //   console.log(res);
      //   if (res.resultado == "Ok") {
      //     return Swal.fire('Validación exitosa', `Se ha valdiado el estudio con folio ${req.sFolio}`, "success").then(r => {
      //       this.router.navigate(['analista/estudios']);
      //     })
      //   }
      //   return Swal.fire('Error', `Error al validar estudio`, "error");
      // }, err => {
      //   return Swal.fire('Error', `Error al validar estudio`, "error");
      // })
    }

    // SOLO VALIDAR - EJECUTIVO
    if (param == 'validar') {
      this.estudiosService.validarSolicitud(reqValidar).subscribe((res:any) => {
        console.log(res);
        if (res.resultado == "Ok") {
          return Swal.fire('Validación exitosa', `Se ha validado el estudio con folio ${req.sFolio}`, "success").then(r => {
            this.router.navigate([this.regresar]);
          })
        }
        return Swal.fire('Error', `Error al validar estudio`, "error");
      }, err => {
        return Swal.fire('Error', `Error al validar estudio`, "error");
      })
    }

    // SOLICITAR - CLIENTE
    if (param == 'solicitar') {
      this.estudiosService.crearEstudio(req).subscribe((res: any) => {
        if (res.resultado == "Ok") {
          return Swal.fire('Registro exitoso', `Se ha registrado un nuevo estudio con folio ${req.sFolio}`, "success").then(r => {
            this.router.navigate([this.regresar]);
          })
        } else {
          return Swal.fire('Error', `Error al registrar Estudio`, "error");
        }
      }, err => {
        return Swal.fire('Error', `Error al registrar Estudio`, "error");
      })
    }

  }


  declinarSolicitud() {
    Swal.fire({
      title: 'Declinar solicitud',
      text: "¿Estás seguro que deseas declinar la solicitud?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Declinar'
      }).then((result) => {
      console.log(result);
      
      if (result.value) {
        let body = {
          sService: 'declinarSolicitud',
          iIdSolicitud: this.idSolicitud
        }
        this.estudiosService.declinarSolicitud(body).subscribe((res: any) => {
          
          if (res.resultado !== 'Ok') {
            return Swal.fire( 'Error', 'Error al declinar la solicitud', 'warning').then(() => {
              this.router.navigate(['ejecutivo/estudios']);
            })
          }
          return Swal.fire( 'Solicitud declinada', 'La solicitud se ha declinado con éxito', 'success').then(() => {
            this.router.navigate(['ejecutivo/estudios']);
          })
        })
      }

    })
  }
}

