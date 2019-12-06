import { Component, OnInit, ViewChild, DoCheck, Output, EventEmitter } from "@angular/core";
import { DatosEjecutivoService } from "../../../../services/datos-ejecutivo.service";
import { DatosEjecutivo } from "../../../../interfaces/datos-ejecutivo";
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from "@angular/material/table";
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

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

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('fechaI', { static: false }) fechaI: MatDatepicker<any>;
  @ViewChild('fechaF', { static: false }) fechaF: MatDatepicker<any>;

  // @Output() fechaInicioEvent: EventEmitter<MatDatepickerInputEvent<any>>;
  // @Output() fechaFinEvent: EventEmitter<MatDatepickerInputEvent<any>>; (dateChange)="fechaFinEvent($event)"
  fechaInicio: Date;
  fechaFin: Date;

  form: FormGroup;

  constructor(private datosService: DatosEjecutivoService, private fb: FormBuilder) {

    this.datosService.getUsers().subscribe(res => {
      this.datos = res;
      // console.log(this.datos)
      this.dataSource = new MatTableDataSource<DatosEjecutivo>(this.datos);
      this.dataSource.paginator = this.paginator;
    });
  }

  ngOnInit() {
    this.formInit();
  }

  formInit() {
    this.form = this.fb.group({
      fechaInicioForm: new FormControl({ value: '', disabled: true }),
      fechaFinalForm: new FormControl({ value: '', disabled: true }),
    })
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


}
