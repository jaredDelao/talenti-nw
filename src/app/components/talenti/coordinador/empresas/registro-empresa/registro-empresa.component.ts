import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { SelectionModel } from "@angular/cdk/collections";
import { MatPaginator } from "@angular/material/paginator";
import Swal from "sweetalert2";
import { ActivatedRoute, Router } from '@angular/router';
import { EmpresasService } from 'src/app/services/coordinador/empresas.service';
import { CatalogoEstudios, CatalogoEstudio } from 'src/app/interfaces/talenti/coordinador/catalogo-estudios';
import { pluck } from 'rxjs/operators';

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
  loader: boolean = false;

  //Token img
  tokenImg: string = '';
  previewImg: any = null;

  public registerEmpresa = {
    sService: 'registraEmpresa',
    sNombreEmpresa: null,
    sTipoFolio: null,
    logotipo: '',
  };

  public reqArchivo = {
    sService: 'subirArchivo',
    Archivo: '',
    p: '()_A81523[]'
  }

  dataFolio: Object[] = [
    { id: 'e', descripcion: "Folio Editable" },
    { id: 'f', descripcion: "Folio Fijo" }
  ];

  empresaById: any;

  constructor(private _route: ActivatedRoute, private empresasService: EmpresasService, private router: Router) {}

  ngOnInit() {
    this.getIdEmpresa();
    // this.getCatalogoEstudios();
    this.getAllEstudios();
  }

  getIdEmpresa() {
    this.idEmpresa = this._route.snapshot.paramMap.get('id');
    console.log(this.idEmpresa);
    if (this.idEmpresa) {
      this.empresasService.getEmpresaById(this.idEmpresa).subscribe((empresa: any) => {
        this.empresaById = empresa.Empresas[0];
        // Validacion error
        if (empresa.status !== 'Ok') return Swal.fire('Error', 'Error al consultar empresa', 'error').then(() => {
          return this.router.navigate(['/coordinador/empresas']);
        })
      })
    }
  }

  setValue(value) {
    this.registerEmpresa.sNombreEmpresa = value.sNombreEmpresa;
    this.registerEmpresa.sTipoFolio = value.sTipoFolio;

    // for (let i = 0; i < this.catalogoEstudios.length; i++) {
    //   let iIdEstudio = this.catalogoEstudios[i].iIdEstudio;
    //   let req = {
    //     sService: 'getTarifas',
    //     iIdEstudio,
    //     iIdEmpresa: this.idEmpresa
    //   }
    //   this.empresasService.getTarifas(req).subscribe((tarifa:any)=> {
    //     if (tarifa.resultado.length > 0) {
    //       let setterValue = {
    //         iIdEstudio,
    //         sNombreEstudio: this.catalogoEstudios[i].sNombreEstudio,
    //         sDescripcion: this.catalogoEstudios[i].sDescripcion,
    //         dCosto1: tarifa.resultado[0].dCosto1,
    //         dCosto2: tarifa.resultado[0].dCosto2,
    //       }
    //       this.selection.toggle(setterValue);
    //       this.selection.isSelected(setterValue);
    //     }
    //   })
    // }    
    
  }

  selectRow(row) {
    console.log(row);
    console.log(this.selection);
    
    
    this.selection.toggle(row)
  }

  consultarEmpresa() {

  }
  
  InitMatTable() {
    this.dataSource = new MatTableDataSource(this.catalogoEstudios);
    // this.dataSource.paginator = this.paginator;
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

      console.log(this.selection);
      
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

  // getCatalogoEstudios() {
  //   this.empresasService.getCatalogoEstudios().subscribe((estudios: CatalogoEstudios) => {
  //     this.catalogoEstudios = estudios.estudios;
  //     this.InitMatTable();
  //   });
  // }

  // Lista de estudios
  getAllEstudios() {
    this.empresasService.getAllEstudios().pipe(
      pluck('LstEstudios')
    )
      .subscribe((res: any) => {
        this.catalogoEstudios = res;
        this.InitMatTable();
      }, (err) => Swal.fire('Error', 'Error al mostrar lista de estudios', 'error'), (() => {
        // SetValue
        if (this.idEmpresa) {
          setTimeout(() => {
            this.setValue(this.empresaById);
          }, 500)
        }
      }));
  }

  stop() {
    event.stopPropagation();
  }

  subirImagen(e) {

    let blob = e.target.files[0];
    let name = e.target.files[0].name;
    
    this.previewImage(blob)

    this.loader = true;
    this.empresasService.subirArchivo(blob, name).subscribe((resp: any ) => {
      
      if (!resp.Identificador || resp.resultado != 'Ok') {
        this.loader = false;
        this.reqArchivo.Archivo = null;
        return Swal.fire('Error al cargar imagen', 'Revisa que sea un formato válido', 'error');
      }

      this.registerEmpresa.logotipo = resp.Identificador;
      
    }, (err) => {
      this.loader = false;
      this.reqArchivo.Archivo = null;
      return Swal.fire('Error al cargar imagen', 'Revisa que sea un formato válido', 'error');
    }, () => {
      this.loader = false;
    });
  }

  previewImage(blob) {
    const mimeType = blob.type;
    if (mimeType.match(/image\/*/) == null) {
      this.reqArchivo.Archivo = null;
      return;
    }
    let reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = (event: any) => {
      this.previewImg = event.target.result;
    }
  }

  registraEmpresa() {
    console.log(this.registerEmpresa);
    return this.empresasService.registrarEmpresa(this.registerEmpresa).toPromise();
  }

  async enviar() {
    let respEmpresa: any = await this.registraEmpresa();
    // Falta validar si falla el registraEmpresa
    
    this.idEmpresa = respEmpresa.iIdEmpresa;    
    const selection = this.selection.selected;

    // Validar campos vacios
    // if (selection.length > 0) {
    //   for (let i = 0; i < selection.length; i++) {
    //     if (selection[i].costoEstudio !== null && selection[i].costoCancelado !== null) {
    //       this.validEstudios = true;
    //     } else {
    //       this.validEstudios = false;
    //       break;
    //     }
    //   }
    // } else {
    //   this.validEstudios = false;
    // }

    // if (!this.validEstudios || this.empresa.nombre === null || this.empresa.nombre === '' 
    //     || this.empresa.imagen === null || this.empresa.tipo_folio === null) {
    //   Swal.fire({
    //     icon: "error",
    //     title: "Faltan campos...",
    //     text: "Aún faltan campos requeridos por llenar"   
    //   });
    // } else {
    //   Swal.fire({
    //     icon: "success",
    //     title: "Listo",   
    //     text: "Campos guardados correctamente",   
    //   });
    // }

    // Request
    console.log(selection);
    console.log('IdEmpresa:: ', this.idEmpresa);
    

    // Validación campos empresa
    if (this.idEmpresa == 'Error') {
      return Swal.fire({
            icon: 'warning',
            title: "Campos incompletos",
            text: "Faltan llenar campos de empresa"   
          });
    }

    selection.map((estudio: any) => {
      const {iIdEstudio, dCosto1, dCosto2} = estudio;
      let request = {
        sService: 'registraTarifas',
        iIdEmpresa: this.idEmpresa,
        iIdEstudio,
        dCosto1,
        dCosto2
      };

      // Subscribe
      console.log(request);
      
      this.empresasService.registraTarifa(request).subscribe(resp => {
        console.log(resp);
      });

    });
  }
}
