import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { EstudiosAnalistaService } from 'src/app/services/analista/estudios-analista.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-subir-preliminar-modal',
  templateUrl: './subir-preliminar-modal.component.html',
  styleUrls: ['./subir-preliminar-modal.component.scss']
})
export class SubirPreliminarModalComponent implements OnInit {

  // catalogo estatus dictamen
  catDictamen = [
    {id: '1', name: 'EN PROCESO'},
    {id: '2', name: 'RECOMENDADO'},
    {id: '3', name: 'NO RECOMENDADO'},
    {id: '4', name: 'RECOMENDADO CON RESERVA'},
  ];
  catDictamenGNP = [
    {id: '10', name: 'EN PROCESO'},
    {id: '11', name: 'RIESGO 1'},
    {id: '12', name: 'RIESGO 2'},
    {id: '13', name: 'RIESGO 3'},
    {id: '14', name: 'SIN RIESGO'},
  ];

  catSelectDisctamen: any[];
  // subirPreliminar - subirDictamen
  idArchivoTipo: any;

  form: FormGroup;
  constructor(public dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
              public estudiosAnalistaService: EstudiosAnalistaService) { }


  ngOnInit() {
    this.formInit();
    console.log(this.data);
    this.catSelectDisctamen = this.catDictamen;
    this.idArchivoTipo = this.data.id;
  }

  formInit() {
    this.form = this.fb.group({
      sService: new FormControl(this.data.id),
      iIdSolicitud: new FormControl(this.data.idSolicitud),
      sToken: new FormControl(this.data.token),
      estatusDictamen: new FormControl(null, Validators.required),
    });
  }

  enviar() {

    // Validar formulario
    if (this.form.invalid) {
      return Swal.fire('Error', 'Faltan campos por ingresar', 'error');
    }

    let body = this.form.getRawValue();
    
    console.log(body);
    
    this.estudiosAnalistaService.subirArchivo(body).subscribe((res: any) => {
      console.log(res);
      if (res.resultado !== 'Ok') {
        return Swal.fire('Error', 'Error al subir archivo', 'error').then(() => {
          this.dialogRef.close();
        })
      }

      return Swal.fire('Archivo subido correctamente', 'Tu archivo ha sido subido exitosamente', 'success').then(() => {
        this.dialogRef.close();
      })
    })
  }

}
