import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AnalistaRouting } from './analista.routing.module';

// components
import { MaterialModule } from 'src/app/material.module';

import { CustomComponentsModule } from '../../../shared/customComponents.module';
import { EstudiosAnalistaComponent } from './estudios-analista/estudios-analista.component';
import { EjecutivoModule } from '../ejecutivo/ejecutivo.module';
import { DetalleEstudioAnalistaComponent } from './detalle-estudio-analista/detalle-estudio-analista.component';
import { SubirPreliminarModalComponent } from './modals/subir-preliminar-modal/subir-preliminar-modal.component';
import { SubirDictamenModalComponent } from './modals/subir-dictamen-modal/subir-dictamen-modal.component';


@NgModule({
  imports: [
    CommonModule,
    AnalistaRouting,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    CustomComponentsModule,
    EjecutivoModule,
  ],
  declarations: [
    EstudiosAnalistaComponent,
    DetalleEstudioAnalistaComponent,
    SubirPreliminarModalComponent,
    SubirDictamenModalComponent,
  ],
  providers: [],
  entryComponents: [
    SubirPreliminarModalComponent,
    SubirDictamenModalComponent,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AnalistaModule { }