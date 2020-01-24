import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { DatosEjecutivoComponent } from './components/talenti/ejecutivo/solicitud-estudios/datos-ejecutivo.component';
import { HttpClientModule } from '@angular/common/http';
import { DatosEjecutivoService } from './services/datos-ejecutivo.service';
import { RegistrarNuevoClienteComponent } from './components/talenti/coordinador/clientes/registrar-nuevo-cliente/registrar-nuevo-cliente.component';
import { RegistroEmpresaComponent } from './components/talenti/coordinador/empresas/registro-empresa/registro-empresa.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MenuCoordinadorComponent } from './components/talenti/coordinador/menu/menu-coordinador.component';
import { ClientesComponent } from './components/talenti/coordinador/clientes/clientes.component';
import { EmpresasComponent } from './components/talenti/coordinador/empresas/empresas.component';
import { EmpleadosComponent } from './components/talenti/coordinador/empleados/empleados.component';
import { RegistroEmpleadoComponent } from './components/talenti/coordinador/empleados/registro-empleado/registro-empleado.component';
import { MenuEjecutivoComponent } from './components/talenti/ejecutivo/menu/menu.component';
import { SolicitarEstudioComponent } from './components/talenti/ejecutivo/solicitar-estudio/solicitar-estudio.component';
import { TitleComponent } from './individual-components/title/title.component';
import { SolicitudCancelacionComponent } from './components/talenti/ejecutivo/solicitud-cancelacion/solicitud-cancelacion.component';
import { NuevaAgendaComponent } from './components/talenti/analista/nueva-agenda/nueva-agenda.component';
import { CancelarSolicitudComponent } from './components/talenti/analista/cancelar-solicitud/cancelar-solicitud.component';
import { MaterialModule } from './material.module';
import { PagesComponent } from './components/pages/pages.component';
import { LoginComponent } from './components/login/login.component';
import { DetalleEstudioClienteComponent } from './components/cliente/detalle-estudio-cliente/detalle-estudio-cliente.component';
import { CancelarSolicitudClienteComponent } from './components/cliente/modals/cancelar-solicitud-cliente/cancelar-solicitud-cliente.component';
import { SolicitudEstudioClienteComponent } from './components/cliente/solicitud-estudio-cliente/solicitud-estudio-cliente.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MAT_DATE_LOCALE } from '@angular/material';
import { EmpresasService } from './services/coordinador/empresas.service';

@NgModule({
  declarations: [
    AppComponent,
    DatosEjecutivoComponent,
    RegistrarNuevoClienteComponent,
    RegistroEmpresaComponent,
    RegistroEmpleadoComponent,
    MenuCoordinadorComponent,
    ClientesComponent,
    EmpresasComponent,
    EmpleadosComponent,
    MenuEjecutivoComponent,
    SolicitarEstudioComponent,
    TitleComponent,
    SolicitudCancelacionComponent,
    NuevaAgendaComponent,
    CancelarSolicitudComponent,
    PagesComponent,
    LoginComponent,
    DetalleEstudioClienteComponent,
    CancelarSolicitudClienteComponent,
    SolicitudEstudioClienteComponent,
    DashboardComponent
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    MaterialModule,
  ],
  exports: [
    HttpClientModule,
  ],
  providers: [
    DatosEjecutivoService,
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
    EmpresasService
  ],
  entryComponents: [
    CancelarSolicitudClienteComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
