import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { CancelarSolicitudClienteComponent } from '../modals/cancelar-solicitud-cliente/cancelar-solicitud-cliente.component';

const ELEMENT_DATA = [
  {
    proceso: "Solicitud",
    fecha: "11/10/2019",
    hora: 1.0079,
    status: "VALIDADO"
  },
  {
    proceso: "Agenda",
    fecha: "30/11/2019",
    hora: 4.0026,
    status: "REAGENDADO"
  },
  {
    proceso: "Aplicación",
    fecha: "25/12/2019",
    hora: 6.941,
    status: "EXITOSO"
  },
  { proceso: "Global", fecha: "1/01/2020", hora: 9.0122, status: "PUBLICADO" }
];
const ELEMENT_DATA2 = [
  { estudios: "Solicitud", documentos: "11/10/2019", cancelados: "VALIDADO" },
  { estudios: "Agenda", documentos: "30/11/2019", cancelados: "REAGENDADO" }
];

@Component({
  selector: "app-detalle-estudio-cliente",
  templateUrl: "./detalle-estudio-cliente.component.html",
  styleUrls: ["./detalle-estudio-cliente.component.scss"]
})
export class DetalleEstudioClienteComponent implements OnInit {
  displayedColumns: string[] = ["proceso", "fecha", "hora", "status"];
  dataSource = ELEMENT_DATA;
  displayedColumns2: string[] = ["estudios", "documentos", "cancelados"];
  dataSource2 = ELEMENT_DATA2;

  constructor(public dialog: MatDialog) {}

  ngOnInit() {}

  openDialog(): void {
    const dialogRef = this.dialog.open(CancelarSolicitudClienteComponent, {
      width: "60%",
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {});
  }
}
