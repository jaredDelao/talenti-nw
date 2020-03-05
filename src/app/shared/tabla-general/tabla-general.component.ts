import { Component, OnInit, Input } from '@angular/core';

const ELEMENT_DATA2 = [
  { id: 1, estudios: "Solicitud", documentos: "11/10/2019", cancelados: "VALIDADO" },
  { id: 2, estudios: "Agenda", documentos: "30/11/2019", cancelados: "REAGENDADO" }
];

@Component({
  selector: 'app-tabla-general',
  templateUrl: './tabla-general.component.html',
  styleUrls: ['./tabla-general.component.scss']
})
export class TablaGeneralComponent implements OnInit {

  @Input('titulo') titulo: string;
  @Input('columns') columns: Array<string>;
  @Input('data') data: any;
  @Input('archivo') archivo: boolean = false;

  displayedColumns: Array<string> = [];
  dataSource: any;
  
  constructor() { }
  
  ngOnInit() {
    this.displayedColumns = this.columns;
    this.dataSource = this.data
  }

}
