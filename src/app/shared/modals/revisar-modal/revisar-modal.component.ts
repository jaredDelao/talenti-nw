import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { EstudiosAnalistaService } from 'src/app/services/analista/estudios-analista.service';

@Component({
  selector: 'app-revisar-modal',
  templateUrl: './revisar-modal.component.html',
  styleUrls: ['./revisar-modal.component.scss']
})
export class RevisarModalComponent implements OnInit {

  titulo: any;

  request = {
    sService: '',
    iIdSolicitud: null,
    sMotivo: null
  }
  // 1 preliminar - 2 estudio - 3 complemento
  sRechazo: any;

  constructor(public dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: any, public estudiosAnalistaService: EstudiosAnalistaService) { }

  ngOnInit() {
    this.titulo = this.data.titulo;
    this.sRechazo = this.data.sRechazo;
    console.log(this.data);
  }

  cancelar() {
    this.dialogRef.close();
  }

  rechazar() {
    this.request.iIdSolicitud = this.data.idSolicitud;

    if (!this.request.sMotivo) {
      return Swal.fire('Error','Faltan campos por llenar', 'warning');
    }

    switch(this.sRechazo) {
      case 1:
        this.request.sService = 'rechazarPreliminar';
        console.log(this.request);
        
        this.estudiosAnalistaService.rechazarPreliminar(this.request).subscribe((res: any) => {
          if (res.resultado != 'Ok') return Swal.fire('Error', 'Error al rechazar preliminar', 'error');
          return Swal.fire('Preliminar rechazado exitosamente', '', 'success').then(() => {
            this.dialogRef.close();
          })
        });
        break;

      case 2:
        this.request.sService = 'rechazarDictamen';
        console.log(this.request);
        
        this.estudiosAnalistaService.rechazarEstudioSoc(this.request).subscribe((res: any) => {
          if (res.resultado != 'Ok') return Swal.fire('Error', 'Error al rechazar estudio', 'error');
          return Swal.fire('Estudio rechazado exitosamente', '', 'success').then(() => {
            this.dialogRef.close();
          })
        });
        break;

      case 3:
        this.request.sService = 'rechazarComplemento';
        console.log(this.request);
        
        this.estudiosAnalistaService.rechazarComplemento(this.request).subscribe((res: any) => {
          if (res.resultado != 'Ok') return Swal.fire('Error', 'Error al rechazar complemento', 'error');
          return Swal.fire('Complemento rechazado exitosamente', '', 'success').then(() => {
            this.dialogRef.close();
          })
        });
        break;
      
      default:
        return Swal.fire('Error', 'Error al rechazar documento', 'error');

    }
  }

}
