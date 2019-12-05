import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { SelectionModel } from "@angular/cdk/collections";
import { MatPaginator } from "@angular/material/paginator";
import Swal from "sweetalert2";
import { ActivatedRoute } from '@angular/router';

export interface Precios {
  descripcion: string;
  costoReal: number;
  costoCancelado: number;
}
const ELEMENT_DATA: Precios[] = [
  {
    descripcion: "Estudio Socioeconómico",
    costoReal: 1200,
    costoCancelado: 1.0079
  },
  {
    descripcion: "Estudio Socioeconómico",
    costoReal: 1200,
    costoCancelado: 4.0026
  },
  {
    descripcion: "Estudio Socioeconómico",
    costoReal: 1200,
    costoCancelado: 6.941
  },
  {
    descripcion: "Estudio Socioeconómico",
    costoReal: 1200,
    costoCancelado: 9.0122
  },
  {
    descripcion: "Estudio Socioeconómico",
    costoReal: 1200,
    costoCancelado: 10.811
  },
  {
    descripcion: "Estudio Socioeconómico",
    costoReal: 1200,
    costoCancelado: 12.0107
  },
  {
    descripcion: "Estudio Socioeconómico",
    costoReal: 1200,
    costoCancelado: 14.0067
  },
  {
    descripcion: "Estudio Socioeconómico",
    costoReal: 1200,
    costoCancelado: 15.9994
  },
  {
    descripcion: "Estudio Socioeconómico",
    costoReal: 1200,
    costoCancelado: 18.9984
  },
  {
    descripcion: "Estudio Socioeconómico",
    costoReal: 1200,
    costoCancelado: 20.1797
  }
];
@Component({
  selector: "app-registro-empresa",
  templateUrl: "./registro-empresa.component.html",
  styleUrls: ["./registro-empresa.component.scss"]
})
export class RegistroEmpresaComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  validEstudios: Boolean = false;
  idEmpresa: any;

  public empresa = {
    nombre: null,
    tipo_folio: null,
    imagen: null,
    permisos: []
  };

  dataFolio: Object[] = [
    { id: 1, descripcion: "Folio Editable" },
    { id: 2, descripcion: "Folio Fijo" }
  ];

  constructor(private _route: ActivatedRoute) {}

  ngOnInit() {
    this.idEmpresa = this._route.snapshot.paramMap.get('id');
    console.log(this.idEmpresa)
    this.dataSource.paginator = this.paginator;
  }

  displayedColumns: string[] = [
    "select",
    "descripcion",
    "costoReal",
    "costoCancelado"
  ];
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
    // console.log(this.selection.selected);
  }

  enviar() {
    const selection = this.selection.selected;

    if (selection.length > 0) {
      for (let i = 0; i < selection.length; i++) {
        if (
          selection[i].costoReal !== null &&
          selection[i].costoCancelado !== null
        ) {
          this.validEstudios = true;
        } else {
          this.validEstudios = false;
          break;
        }
      }
    } else {
      this.validEstudios = false;
    }

    if (!this.validEstudios || this.empresa.nombre === null || this.empresa.nombre === '' 
        || this.empresa.imagen === null || this.empresa.tipo_folio === null) {
      Swal.fire({
        icon: "error",
        title: "Faltan campos...",
        text: "Aún faltan campos requeridos por llenar"   
      });
    } else {
      Swal.fire({
        icon: "success",
        title: "Listo",   
        text: "Campos guardados correctamente",   
      });
    }

    this.empresa.permisos = this.selection.selected;
    console.log(this.empresa);
  }
}
