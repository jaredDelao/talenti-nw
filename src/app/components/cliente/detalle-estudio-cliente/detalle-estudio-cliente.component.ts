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
  // { proceso: "Global", fecha: "1/01/2020", hora: 9.0122, status: "PUBLICADO" }
];
@Component({
  selector: "app-detalle-estudio-cliente",
  templateUrl: "./detalle-estudio-cliente.component.html",
  styleUrls: ["./detalle-estudio-cliente.component.scss"]
})
export class DetalleEstudioClienteComponent implements OnInit {

  displayedColumns: string[] = ["proceso", "fecha", "status"];
  dataSource = ELEMENT_DATA;

  columnsPreliminar = ["id", "estudios", "documentos", "cancelados", 'publicar'];
  datosPreliminar = [
    { id: 1, estudios: "est1", documentos: "doc1", cancelados: "VALIDADO" },
    { id: 2, estudios: "est2", documentos: "doc2", cancelados: "REAGENDADO" }
  ];

  // Estudios
  columnsEstudios = ["id", "estudios", "documentos", "revision"];
  datosEstudios = [
    { id: 1, estudios: "est1", documentos: "doc1", cancelados: "VALIDADO" },
    { id: 2, estudios: "est2", documentos: "doc2", cancelados: "REAGENDADO" }
  ];

  // Complemento
  columnsComplemento = ["id", "documentos", "revision"];
  datosComplemento = [
    { id: 1, estudios: "est1", documentos: "doc1", cancelados: "VALIDADO" },
    { id: 2, estudios: "est2", documentos: "doc2", cancelados: "REAGENDADO" }
  ];


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
