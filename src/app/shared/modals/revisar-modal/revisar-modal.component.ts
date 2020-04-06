import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { EstudiosAnalistaService } from 'src/app/services/analista/estudios-analista.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-revisar-modal',
  templateUrl: './revisar-modal.component.html',
  styleUrls: ['./revisar-modal.component.scss']
})
export class RevisarModalComponent implements OnInit {

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
  titulo: any;

  request = {
    sService: '',
    iIdSolicitud: null,
    sMotivo: null,
  }
  catDictamenSelect: any;
  // 1 preliminar - 2 estudio - 3 complemento
  sRechazo: any;

  constructor(public dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: any, public estudiosAnalistaService: EstudiosAnalistaService, public router: Router) { }

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
            location.reload();
            // this.dialogRef.close();
          })
        });
        break;

      case 3:
        this.request.sService = 'rechazarComplemento';
        console.log(this.request);
        
        this.estudiosAnalistaService.rechazarComplemento(this.request).subscribe((res: any) => {
          if (res.resultado != 'Ok') return Swal.fire('Error', 'Error al rechazar complemento', 'error');
          return Swal.fire('Complemento rechazado exitosamente', '', 'success').then(() => {
            // this.router.navigateByUrl('ejecutivo/detalle-estudio/' + this.data.idSolicitud);
            // this.dialogRef.close();
            location.reload();
          })
        });
        break;
      
      default:
        return Swal.fire('Error', 'Error al rechazar documento', 'error');

    }
  }

}
