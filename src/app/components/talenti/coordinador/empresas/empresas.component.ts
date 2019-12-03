import { Component, OnInit } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material/dialog";

const ELEMENT_DATA = [
  { name: "Hydrogen", id: 1 },
  { name: "Helium", id: 2 },
  { name: "Lithium", id: 3 },
  { name: "Beryllium", id: 4 },
  { name: "Boron", id: 5 }
];
@Component({
  selector: "app-empresas",
  templateUrl: "./empresas.component.html",
  styleUrls: ["./empresas.component.scss"]
})
export class EmpresasComponent implements OnInit {
  displayedColumns: string[] = ["empresa", "editar"];
  dataSource = ELEMENT_DATA;

  constructor(public dialog: MatDialog) {}

  ngOnInit() {}

  openDialog(d): void {}
}
