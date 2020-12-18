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
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MAT_DATE_LOCALE } from '@angular/material';
import { LoadingComponent } from './shared/loading/loading.component';
import localEs from '@angular/common/locales/es';
import { DatePipe, registerLocaleData } from '@angular/common';
import {CustomComponentsModule} from './shared/customComponents.module';
import { VerificarEstatusAgendaPipe } from './shared/pipes/verificar-estatus-agenda.pipe';

registerLocaleData(localEs, 'es');


@NgModule({
  declarations: [
    AppComponent,
    MenuCoordinadorComponent,
    PagesComponent,
    LoginComponent,
    DashboardComponent,
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
    DatePipe,
    VerificarEstatusAgendaPipe,
    // { provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
    { provide: LOCALE_ID, useValue: 'es'},
  ],
  entryComponents: [
    // CancelarSolicitudClienteComponent,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  bootstrap: [AppComponent]
})
export class AppModule { }
