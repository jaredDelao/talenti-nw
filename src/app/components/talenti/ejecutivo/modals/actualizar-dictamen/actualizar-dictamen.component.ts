import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EstudiosService } from 'src/app/services/ejecutivo/estudios.service';
import Swal from 'sweetalert2';
import { clienteNormal, clienteGNP } from 'src/app/shared/docs/tiposDictamen';
import { EncriptarDesencriptarService } from 'src/app/services/encriptar-desencriptar.service';

@Component({
  selector: 'app-actualizar-dictamen',
  templateUrl: './actualizar-dictamen.component.html',
  styleUrls: ['./actualizar-dictamen.component.scss']
})
export class ActualizarDictamenComponent implements OnInit {

  catDictamenSelect: any;
  form: FormGroup;
  idSolicitud: any;
  constructor(public estudiosService: EstudiosService, public dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, public encriptarService: EncriptarDesencriptarService) { }

  ngOnInit() {
    this.isGnp();
    this.idSolicitud = this.data.idSolicitud;
    this.formInit();
  }

  isGnp() {
    let bGnp = localStorage.getItem('isGnp');
    this.encriptarService.desencriptar(bGnp).subscribe((value) => {
      if (value == '1') {
        this.catDictamenSelect = clienteGNP;
      } else {
        this.catDictamenSelect = clienteNormal;
      }
    })
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
