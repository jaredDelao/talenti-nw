import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AnalistaRouting } from './analista.routing.module';

// components
import { MaterialModule } from 'src/app/material.module';

import { CustomComponentsModule } from '../../../shared/customComponents.module';
import { EstudiosAnalistaComponent } from './estudios-analista/estudios-analista.component';
import { EjecutivoModule } from '../ejecutivo/ejecutivo.module';


@NgModule({
  imports: [
    CommonModule,
    AnalistaRouting,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    CustomComponentsModule,
    EjecutivoModule,
  ],
  declarations: [
    EstudiosAnalistaComponent
  ],
  providers: [],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AnalistaModule { }