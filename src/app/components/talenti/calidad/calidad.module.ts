import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalidadRouting } from './calidad.routing.module';
import { MaterialModule } from 'src/app/material.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CustomComponentsModule } from 'src/app/shared/customComponents.module';
import { EstudiosCalidadComponent } from './estudios-calidad/estudios-calidad.component';
import { DetalleEstudioCalidadComponent } from './detalle-estudio-calidad/detalle-estudio-calidad.component';

@NgModule({
  declarations: [
    EstudiosCalidadComponent,
    DetalleEstudioCalidadComponent,
  ],
  imports: [
    CommonModule,
    CalidadRouting,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    CustomComponentsModule,
  ],
  // schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class CalidadModule { }
