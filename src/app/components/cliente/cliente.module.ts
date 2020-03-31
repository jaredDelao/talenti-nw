import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClienteRouting } from './cliente.routing.module';

// components
import { MaterialModule } from 'src/app/material.module';
import { CustomComponentsModule } from '../../shared/customComponents.module';
import { DetalleEstudioClienteComponent } from './detalle-estudio-cliente/detalle-estudio-cliente.component';
import { EstudiosClienteComponent } from './estudios-cliente/estudios-cliente.component';
import { EjecutivoModule } from '../talenti/ejecutivo/ejecutivo.module';
import { CancelarSolicitudClienteComponent } from './modals/cancelar-solicitud-cliente/cancelar-solicitud-cliente.component';
import { SolicitudEstudioClienteComponent } from './solicitud-estudio-cliente/solicitud-estudio-cliente.component';




@NgModule({
  imports: [
    CommonModule,
    ClienteRouting,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    CustomComponentsModule,
    EjecutivoModule,
  ],
  declarations: [
    DetalleEstudioClienteComponent,
    EstudiosClienteComponent,
    CancelarSolicitudClienteComponent,
    SolicitudEstudioClienteComponent,
  ],
  providers: [],
  entryComponents: [CancelarSolicitudClienteComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ClienteModule { }