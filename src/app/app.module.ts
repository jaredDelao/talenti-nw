import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// material
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatMenuModule} from '@angular/material/menu';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import {MatNativeDateModule} from '@angular/material';
import { MatIconModule} from '@angular/material';
import { DatosEjecutivoComponent } from './components/ejecutivos/solicitud-estudios/datos-ejecutivo.component';
import { HttpClientModule } from '@angular/common/http';
import { DatosEjecutivoService } from './services/datos-ejecutivo.service';
import { RegistrarNuevoClienteComponent } from './components/ejecutivos/registrar-nuevo-cliente/registrar-nuevo-cliente.component';
import { RegistroEmpresaComponent } from './components/talenti/coordinador/registro-empresa/registro-empresa.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    DatosEjecutivoComponent,
    RegistrarNuevoClienteComponent,
    RegistroEmpresaComponent
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatButtonModule, 
    MatCheckboxModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTableModule,
    HttpClientModule,
    MatPaginatorModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatNativeDateModule,
    MatIconModule,
  ],
  exports: [
    MatButtonModule, 
    MatCheckboxModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTableModule,
    HttpClientModule,
    MatPaginatorModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatIconModule,
  ],
  providers: [
    DatosEjecutivoService,
    MatNativeDateModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
