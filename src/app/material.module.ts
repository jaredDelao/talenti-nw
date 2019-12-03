import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import {
  MatSliderModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatButtonModule,
  MatIconModule,
  MatDialogModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatCardModule,
  MatCheckboxModule,
  MatListModule,
  MatRadioModule,
  MatSidenavModule,
  MatToolbarModule,
  MatExpansionModule,
  MatDividerModule,
  MatTreeModule
} from "@angular/material";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatSliderModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatCheckboxModule,
    DragDropModule,
    MatListModule,
    MatRadioModule,
    MatSidenavModule,
    MatToolbarModule,
    MatExpansionModule,
    MatDividerModule,
    MatTreeModule
  ],
  exports: [
    MatSliderModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatCheckboxModule,
    DragDropModule,
    MatListModule,
    MatRadioModule,
    MatSidenavModule,
    MatToolbarModule,
    MatExpansionModule,
    MatDividerModule,
    MatTreeModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class MaterialModule {}
