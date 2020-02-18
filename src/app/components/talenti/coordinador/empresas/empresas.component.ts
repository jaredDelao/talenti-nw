import { Component, OnInit } from "@angular/core";
import { EmpresasService } from '../../../../services/coordinador/empresas.service';
import { Empresas, TipoEmpresa } from 'src/app/interfaces/talenti/coordinador/empresas';
import { MatTableDataSource } from '@angular/material';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: "app-empresas",
  templateUrl: "./empresas.component.html",
  styleUrls: ["./empresas.component.scss"]
})
export class EmpresasComponent implements OnInit {
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
    }, (err) => Swal.fire('Error al cargar las empresas', '', 'warning'));
  }

  editar(id) {
    this.empresasService.idTipo.next(2);
    this.router.navigate(['/coordinador/empresas/editar-empresa', id])
  }

  openDialog(d): void {}

}
