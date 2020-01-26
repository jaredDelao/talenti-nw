import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { SelectionModel } from "@angular/cdk/collections";
import { MatPaginator } from "@angular/material/paginator";
import Swal from "sweetalert2";
import { ActivatedRoute } from '@angular/router';
import { EmpresasService } from 'src/app/services/coordinador/empresas.service';
import { CatalogoEstudios, CatalogoEstudio } from 'src/app/interfaces/talenti/coordinador/catalogo-estudios';

@Component({
  selector: "app-registro-empresa",
  templateUrl: "./registro-empresa.component.html",
  styleUrls: ["./registro-empresa.component.scss"]
})
export class RegistroEmpresaComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  validEstudios: Boolean = false;
  idEmpresa: any;
  displayedColumns: string[] = ["select","descripcion","costoReal","costoCancelado"];
  selection = new SelectionModel<CatalogoEstudios>(true, []);
  catalogoEstudios: Array<CatalogoEstudio>;
  dataSource: MatTableDataSource<CatalogoEstudio>;

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

  constructor(private _route: ActivatedRoute, private empresasService: EmpresasService) {}

  ngOnInit() {
    this.idEmpresa = this._route.snapshot.paramMap.get('id');
    this.getCatalogoEstudios();
  }
  
  InitMatTable() {
    this.dataSource = new MatTableDataSource<CatalogoEstudio>(this.catalogoEstudios);
    this.dataSource.paginator = this.paginator;
  }

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
      : this.dataSource.data.forEach((row: any) => this.selection.select(row));
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

  getCatalogoEstudios() {
    this.empresasService.getCatalogoEstudios().subscribe((estudios: CatalogoEstudios) => {
      this.catalogoEstudios = estudios.estudios;
      this.InitMatTable();
    });
  }

  stop() {
    event.stopPropagation();
  }

  enviar() {
    const selection = this.selection.selected;

    // Validar campos vacios
    if (selection.length > 0) {
      for (let i = 0; i < selection.length; i++) {
        if (selection[i].costoEstudio !== null && selection[i].costoCancelado !== null) {
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

    // Request
    this.empresa.permisos = this.selection.selected;
    console.log(this.empresa);
  }
}
