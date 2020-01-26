import { Component, OnInit, ViewChild, DoCheck, Output, EventEmitter } from "@angular/core";
import { DatosEjecutivo } from "../../../../interfaces/datos-ejecutivo";
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from "@angular/material/table";
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { EstudiosService } from 'src/app/services/ejecutivo/estudios.service';
import { Estudios, Estudio } from 'src/app/interfaces/talenti/ejecutivo/estudios';

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
  dataSource: MatTableDataSource<Estudio>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('fechaI', { static: false }) fechaI: MatDatepicker<any>;
  @ViewChild('fechaF', { static: false }) fechaF: MatDatepicker<any>;

  // @Output() fechaInicioEvent: EventEmitter<MatDatepickerInputEvent<any>>;
  // @Output() fechaFinEvent: EventEmitter<MatDatepickerInputEvent<any>>; (dateChange)="fechaFinEvent($event)"
  fechaInicio: Date;
  fechaFin: Date;
  estudiosList: Array<Estudio>;
  form: FormGroup;

  constructor(private estudiosService: EstudiosService, private fb: FormBuilder) {
    this.getEstudios();
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

  getEstudios() {
    this.estudiosService.getEstudios().subscribe((estudiosList: Estudios)=> {
      this.estudiosList = estudiosList.estudios;
      this.dataSource = new MatTableDataSource(this.estudiosList);
      this.dataSource.paginator = this.paginator;

      console.log(this.estudiosList);
      
    })
  }


}
