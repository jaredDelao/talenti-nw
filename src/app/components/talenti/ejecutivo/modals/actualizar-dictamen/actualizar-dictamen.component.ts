import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EstudiosService } from 'src/app/services/ejecutivo/estudios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-actualizar-dictamen',
  templateUrl: './actualizar-dictamen.component.html',
  styleUrls: ['./actualizar-dictamen.component.scss']
})
export class ActualizarDictamenComponent implements OnInit {

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

  catDictamenSelect: any;
  form: FormGroup;
  idSolicitud: any;
  constructor(public estudiosService: EstudiosService, public dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) { }

  ngOnInit() {
    this.idSolicitud = this.data.idSolicitud;
    this.formInit();
    this.catDictamenSelect = this.catDictamen;
  }

  formInit() {
    this.form = this.fb.group({
      sService: new FormControl(this.data.id),
      iIdSolicitud: new FormControl(this.data.idSolicitud),
      estatusDictamen: new FormControl(null, Validators.required),
    });
  }

  enviar() {
    this.estudiosService.publicarPreliminar(this.form.getRawValue()).subscribe((res: any) => {
      if (res.resultado !== 'Ok') {
        return Swal.fire('Error', 'Error al publicar el estudio', 'success').then(() => {
          this.dialogRef.close();
        })
      }

      return Swal.fire('Estudio publicado', 'El estudio se ha publicado exitosamente', 'success').then(() => {
        this.dialogRef.close();
      })
      
    })
  }

}
