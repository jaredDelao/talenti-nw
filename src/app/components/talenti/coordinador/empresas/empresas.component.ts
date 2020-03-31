import { Component, OnInit, ViewChild } from "@angular/core";
import { EmpresasService } from '../../../../services/coordinador/empresas.service';
import { Empresas, TipoEmpresa } from 'src/app/interfaces/talenti/coordinador/empresas';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: "app-empresas",
  templateUrl: "./empresas.component.html",
  styleUrls: ["./empresas.component.scss"]
})
export class EmpresasComponent implements OnInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  displayedColumns: string[] = ["empresa", "editar"];
  dataSource: MatTableDataSource<TipoEmpresa>;
  listEmpresas: Array<TipoEmpresa>;

  constructor(private empresasService: EmpresasService, private router: Router) {}

  ngOnInit() {
    this.getEmpresas();
  }
  
  getEmpresas() {
    this.empresasService.getEmpresas().subscribe((empresa: any) => {
      this.listEmpresas = empresa;
      this.dataSource = new MatTableDataSource(this.listEmpresas);
      this.dataSource.paginator = this.paginator;
    }, (err) => Swal.fire('Error al cargar las empresas', '', 'warning'));
  }

  editar(id) {
    this.router.navigate(['/coordinador/empresas/editar-empresa', id])
  }

  openDialog(d): void {}

}
