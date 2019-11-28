import { Component, OnInit, ViewChild } from "@angular/core";
import { DatosEjecutivoService } from "../../../services/datos-ejecutivo.service";
import { DatosEjecutivo } from "../../../interfaces/datos-ejecutivo";
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from "@angular/material/table";


@Component({
  selector: "app-datos-ejecutivo",
  templateUrl: "./datos-ejecutivo.component.html",
  styleUrls: ["./datos-ejecutivo.component.scss"]
})
export class DatosEjecutivoComponent implements OnInit {
  displayedColumns: string[] = [
    'folio', 'estudio', 'nombre', 'estado', 'municipio', 'fecha_solicitud', 'hora_solicitud', 'agendado',
    'fecha_agenda', 'preliminar', 'fecha_aplicacion', 'estatus', 'publicacion', 'dictamen', 'descarga',
    'solicitar_calidad', 'solicitud_calidad', 'certificado_calidad'
  ];
  datos: DatosEjecutivo[] = [];
  dataSource: MatTableDataSource<DatosEjecutivo>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private datosService: DatosEjecutivoService) {
    this.datosService.getUsers().subscribe(res => {
      this.datos = res;
      console.log(this.datos)
      this.dataSource = new MatTableDataSource<DatosEjecutivo>(this.datos);
      this.dataSource.paginator = this.paginator;
    });
  }

  ngOnInit() {    
    
  }
}
