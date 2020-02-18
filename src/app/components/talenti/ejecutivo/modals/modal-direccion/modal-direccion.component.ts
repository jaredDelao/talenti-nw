import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

interface dataInterface {
  estado: string;
  municipio: string;
}

@Component({
  selector: 'app-modal-direccion',
  templateUrl: './modal-direccion.component.html',
  styleUrls: ['./modal-direccion.component.scss']
})
export class ModalDireccionComponent implements OnInit {

  estado: string;
  municipio: string;

  constructor(public dialogRef: MatDialogRef<ModalDireccionComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: dataInterface) { }

  ngOnInit() {
    this.estado = this.data.estado;
    this.municipio = this.data.municipio;
  }

  cerrar() {
    this.dialogRef.close();
  }

}
