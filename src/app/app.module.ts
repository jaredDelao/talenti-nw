import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule, LOCALE_ID, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MenuCoordinadorComponent } from './components/talenti/coordinador/menu/menu-coordinador.component';
import { TitleComponent } from './shared/title/title.component';
import { MaterialModule } from './material.module';
import { PagesComponent } from './components/pages/pages.component';
import { LoginComponent } from './components/login/login.component';
import { DetalleEstudioClienteComponent } from './components/cliente/detalle-estudio-cliente/detalle-estudio-cliente.component';
import { CancelarSolicitudClienteComponent } from './components/cliente/modals/cancelar-solicitud-cliente/cancelar-solicitud-cliente.component';
import { SolicitudEstudioClienteComponent } from './components/cliente/solicitud-estudio-cliente/solicitud-estudio-cliente.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MAT_DATE_LOCALE } from '@angular/material';
import { LoadingComponent } from './shared/loading/loading.component';
import localEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localEs, 'es');
import {CustomComponentsModule} from './shared/customComponents.module';

@NgModule({
  declarations: [
    AppComponent,
    MenuCoordinadorComponent,
    // TitleComponent,
    PagesComponent,
    LoginComponent,
    DetalleEstudioClienteComponent,
    CancelarSolicitudClienteComponent,
    SolicitudEstudioClienteComponent,
    DashboardComponent,
    // LoadingComponent,
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CustomComponentsModule,
    HttpClientModule,
    MaterialModule,
  ],
  exports: [
    HttpClientModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
    { provide: LOCALE_ID, useValue: 'es'},
  ],
  entryComponents: [
    // CancelarSolicitudClienteComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
