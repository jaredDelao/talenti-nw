import { Component, OnInit } from "@angular/core";
import { EmpresasService } from '../../../../services/coordinador/empresas.service';
import { Empresas, TipoEmpresa } from 'src/app/interfaces/talenti/coordinador/empresas';
import { MatTableDataSource } from '@angular/material';
import Swal from 'sweetalert2';

@Component({
  selector: "app-empresas",
  templateUrl: "./empresas.component.html",
  styleUrls: ["./empresas.component.scss"]
})
export class EmpresasComponent implements OnInit {
  displayedColumns: string[] = ["empresa", "editar"];
  dataSource: MatTableDataSource<TipoEmpresa>;
  listEmpresas: Array<TipoEmpresa>;

  constructor(private empresasService: EmpresasService) {}

  ngOnInit() {
    this.getEmpresas();
  }
  
  getEmpresas() {
    this.empresasService.getEmpresas().subscribe((empresa: any) => {
      this.listEmpresas = empresa;
      this.dataSource = new MatTableDataSource(this.listEmpresas);
    }, (err) => Swal.fire('Error al cargar las empresas', '', 'warning'));
  }

  openDialog(d): void {}

}
