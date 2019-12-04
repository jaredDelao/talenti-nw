import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from '@angular/material';

@Component({
  selector: "app-cancelar-solicitud-cliente",
  templateUrl: "./cancelar-solicitud-cliente.component.html",
  styleUrls: ["./cancelar-solicitud-cliente.component.scss"]
})
export class CancelarSolicitudClienteComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CancelarSolicitudClienteComponent>
  ) {}

  ngOnInit() {}

  close() {
    this.dialogRef.close();
  }
}
