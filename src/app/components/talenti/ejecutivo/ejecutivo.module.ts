import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// components
import { DatosEjecutivoComponent } from './solicitud-estudios/datos-ejecutivo.component';
import { SolicitarEstudioComponent } from './solicitar-estudio/solicitar-estudio.component';
import { SolicitudCancelacionComponent } from './solicitud-cancelacion/solicitud-cancelacion.component';
import { MaterialModule } from 'src/app/material.module';
import { DatosEjecutivoService } from 'src/app/services/datos-ejecutivo.service';
import { EjecutivoRouting } from './ejecutivo.routing.module';

// Modals
import { ModalDireccionComponent } from './modals/modal-direccion/modal-direccion.component';
import { MenuEjecutivoComponent } from './menu/menu.component';
import { TitleComponent } from '../../../shared/title/title.component';
import { CustomComponentsModule } from '../../../shared/customComponents.module';
import { DetalleEstudioEjecutivoComponent } from './detalle-estudio-ejecutivo/detalle-estudio-ejecutivo.component';
import { TablaGeneralComponent } from '../../../shared/tabla-general/tabla-general.component';

@NgModule({
  imports: [
    CommonModule,
    EjecutivoRouting,
    MaterialModule,
    HttpClientModule,
    CustomComponentsModule,
    ReactiveFormsModule
  ],
  declarations: [
    SolicitudCancelacionComponent,
    SolicitarEstudioComponent,
    DatosEjecutivoComponent,
    ModalDireccionComponent,
    MenuEjecutivoComponent,
    DetalleEstudioEjecutivoComponent,
  ],
  exports: [DatosEjecutivoComponent],
  entryComponents: [ModalDireccionComponent],
  providers: [DatosEjecutivoService],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class EjecutivoModule { }