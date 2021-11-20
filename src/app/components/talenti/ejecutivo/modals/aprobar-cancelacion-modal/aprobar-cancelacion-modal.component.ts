import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EstudiosService } from 'src/app/services/ejecutivo/estudios.service';
import { ClienteService } from 'src/app/services/cliente/cliente.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-aprobar-cancelacion-modal',
  templateUrl: './aprobar-cancelacion-modal.component.html',
  styleUrls: ['./aprobar-cancelacion-modal.component.scss']
})
export class AprobarCancelacionModalComponent implements OnInit {

  form: FormGroup;
  tiposCancelacionList: any[] = [];

  constructor(public dialogRef: MatDialogRef<any>, private fb: FormBuilder, public estudiosService: EstudiosService,
    @Inject(MAT_DIALOG_DATA) public data: any, private clienteService: ClienteService) { }

  ngOnInit() {
    this.formInit();
    this.getTiposCancelacion();
  }

  formInit() {
    this.form = this.fb.group({
      sService: ['aprobarCancelacion'],
      iIdSolicitud: [null],
      bcosto: [null, Validators.required],
      iTipoCancelacion: [null, Validators.required],
    })
  }

  getTiposCancelacion() {
    this.clienteService.getTiposCancelacion().subscribe((resp: any) => {
      this.tiposCancelacionList = resp.Tipos;
    })
  }

  enviar() {
    let req = this.form.getRawValue();
    this.form.get('iIdSolicitud').patchValue(this.data.idSolicitud);    
    this.estudiosService.aprobarCancelacion(this.form.getRawValue()).subscribe((resp: any) => {
      if (resp.resultado != 'Ok') {
        return Swal.fire('Error', 'Error al aprobar cancelacion', 'error');
      }

      return Swal.fire('Aprobación exitosa', 'El estudio se ha cancelado exitosamente', 'success').then(() => {
        this.dialogRef.close();
      })
    })
  }
}
