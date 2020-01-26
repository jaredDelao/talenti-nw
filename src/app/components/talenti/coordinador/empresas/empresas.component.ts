import { Component, OnInit } from "@angular/core";
import { EmpresasService } from '../../../../services/coordinador/empresas.service';
import { Empresas, TipoEmpresa } from 'src/app/interfaces/talenti/coordinador/empresas';
import { MatTableDataSource } from '@angular/material';

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
    this.empresasService.getEmpresas().subscribe((empresa: Empresas) => {
      this.listEmpresas = empresa.empresas;
      this.dataSource = new MatTableDataSource(this.listEmpresas);
    })
  }

  openDialog(d): void {}

}
