import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// components
import { MaterialModule } from 'src/app/material.module';
import { AnalistaRouting } from './analista.routing.module';
import { NuevaAgendaComponent } from './nueva-agenda/nueva-agenda.component';
import { CancelarSolicitudComponent } from './cancelar-solicitud/cancelar-solicitud.component';

@NgModule({
  imports: [
    CommonModule,
    AnalistaRouting,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  declarations: [
    NuevaAgendaComponent,
    CancelarSolicitudComponent,
  ],
  providers: [],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AnalistaModule { }