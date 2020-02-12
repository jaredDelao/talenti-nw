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
    'folio', 'estudio', 'nombre', 'estado', 'municipio', 'fecha_solicitud', 'hora_solicitud', 'estatus_solicitud', 
    'estatus_agendado', 'fecha_agenda', 'estatus_aplicacion', 'fecha_aplicacion', 'preliminar', 'publicacion_preliminar', 
    'estatus_preliminar', 'publicacion_estudio', 'descarga',  'publicacion_dictamen', 'estatus_dictamen',
    'solicitar_calidad', 'certificado_calidad', 'solicitud_cancelacion', 'tipo_cancelacion', 'aprobar_cancelacion',
    'evidencia', 'comentarios'
  ];
  dataSource: MatTableDataSource<Estudio>;

  req = {
    sService: 'getSolicitudesEjecutivo',
    iIdEjecutivo: '1'
  }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('fechaI', { static: false }) fechaI: MatDatepicker<any>;
  @ViewChild('fechaF', { static: false }) fechaF: MatDatepicker<any>;

  // @Output() fechaInicioEvent: EventEmitter<MatDatepickerInputEvent<any>>;
  // @Output() fechaFinEvent: EventEmitter<MatDatepickerInputEvent<any>>; (dateChange)="fechaFinEvent($event)"
  fechaInicio: Date;
  fechaFin: Date;
  estudiosList: Array<any>;
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
    this.estudiosService.getEstudios(this.req).subscribe((estudiosList: any)=> {
      console.log(estudiosList);

      const {resultado} = estudiosList;
      this.estudiosList = resultado;
      this.dataSource = new MatTableDataSource(this.estudiosList);
      this.dataSource.paginator = this.paginator;

      console.log(this.dataSource);
      
      
    })
  }


}
