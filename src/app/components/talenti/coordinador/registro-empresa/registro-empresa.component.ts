import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import {SelectionModel} from '@angular/cdk/collections';

export interface Precios {
  descripcion: string;
  costoReal: number;
  costoCancelado: number;
  costoCancelado2: number;
}
const ELEMENT_DATA: Precios[] = [
  { descripcion: 'Estudio Socioeconómico', costoReal: 1200, costoCancelado: 1.0079, costoCancelado2: 500 },
  { descripcion: 'Estudio Socioeconómico', costoReal: 1200, costoCancelado: 4.0026, costoCancelado2: 500 },
  { descripcion: 'Estudio Socioeconómico', costoReal: 1200, costoCancelado: 6.941, costoCancelado2: 500 },
  { descripcion: 'Estudio Socioeconómico', costoReal: 1200, costoCancelado: 9.0122, costoCancelado2: 500 },
  { descripcion: 'Estudio Socioeconómico', costoReal: 1200, costoCancelado: 10.811, costoCancelado2: 500 },
  { descripcion: 'Estudio Socioeconómico', costoReal: 1200, costoCancelado: 12.0107, costoCancelado2: 500 },
  { descripcion: 'Estudio Socioeconómico', costoReal: 1200, costoCancelado: 14.0067, costoCancelado2: 500 },
  { descripcion: 'Estudio Socioeconómico', costoReal: 1200, costoCancelado: 15.9994, costoCancelado2: 500 },
  { descripcion: 'Estudio Socioeconómico', costoReal: 1200, costoCancelado: 18.9984, costoCancelado2: 500 },
  { descripcion: 'Estudio Socioeconómico', costoReal: 1200, costoCancelado: 20.1797, costoCancelado2: 500 }
];
@Component({
  selector: "app-registro-empresa",
  templateUrl: "./registro-empresa.component.html",
  styleUrls: ["./registro-empresa.component.scss"]
})
export class RegistroEmpresaComponent implements OnInit {
  constructor() {}

  dataFolio: Object[] = [
    { id: 1, descripcion: "Folio Editable" },
    { id: 2, descripcion: "Folio Fijo" }
  ];

  ngOnInit() {}

  displayedColumns: string[] = ["select","descripcion","costoReal","costoCancelado","costoCancelado2"];
  dataSource = new MatTableDataSource<Precios>(ELEMENT_DATA);
  selection = new SelectionModel<Precios>(true, []);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  // checkboxLabel(row?: PeriodicElement): string {
  //   if (!row) {
  //     return `${this.isAllSelected() ? "select" : "deselect"} all`;
  //   }
  //   return `${
  //     this.selection.isSelected(row) ? "deselect" : "select"
  //   } row ${row.position + 1}`;

  //   console.log(this.selection)
  // }

  getData(e) {
    
    console.log(this.selection.selected);
  }
}
