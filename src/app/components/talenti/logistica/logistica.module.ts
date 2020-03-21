import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AmazingTimePickerModule } from 'amazing-time-picker'; // this line you need

// components
import { MaterialModule } from 'src/app/material.module';
import { LogisticaRouting } from './logistica.routing.module';
import { NuevaAgendaComponent } from './nueva-agenda/nueva-agenda.component';
import { CancelarSolicitudComponent } from './cancelar-solicitud/cancelar-solicitud.component';
import { CustomComponentsModule } from '../../../shared/customComponents.module';
import { EstudiosLogisticaComponent } from './estudios-logistica/estudios-logistica.component';
import { DetalleEstudioLogisticaOrdinarioComponent } from './detalle-estudio-logistica-ordinario/detalle-estudio-logistica-ordinario.component';
import { DetalleEstudioLogisticaSupervisorComponent } from './detalle-estudio-logistica-supervisor/detalle-estudio-logistica-supervisor.component';

@NgModule({
  imports: [
    CommonModule,
    LogisticaRouting,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    CustomComponentsModule,
    AmazingTimePickerModule,
  ],
  declarations: [
    NuevaAgendaComponent,
    CancelarSolicitudComponent,
    EstudiosLogisticaComponent,
    DetalleEstudioLogisticaOrdinarioComponent,
    DetalleEstudioLogisticaSupervisorComponent,
  ],
  providers: [],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class LogisticaModule { }