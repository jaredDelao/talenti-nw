import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// components
import { RegistroEmpresaComponent } from './empresas/registro-empresa/registro-empresa.component';
import { ClientesComponent } from './clientes/clientes.component';
import { RegistrarNuevoClienteComponent } from './clientes/registrar-nuevo-cliente/registrar-nuevo-cliente.component';
import { EmpresasComponent } from './empresas/empresas.component';
import { EmpleadosComponent } from './empleados/empleados.component';
import { RegistroEmpleadoComponent } from './empleados/registro-empleado/registro-empleado.component';
import { MaterialModule } from 'src/app/material.module';
import { CoordinadorRouting } from './coordinador.routing.module';
import { ClientesService } from 'src/app/services/coordinador/clientes.service';
import { EmpleadosService } from 'src/app/services/coordinador/empleados.service';
import { EmpresasService } from 'src/app/services/coordinador/empresas.service';
import { LoadingComponent } from 'src/app/shared/loading/loading.component';
import { CustomComponentsModule } from 'src/app/shared/customComponents.module';
import { DisableControlDirective } from 'src/app/shared/directives/disable-control.directive';
import { EstudiosCoordinadorComponent } from './estudios-coordinador/estudios-coordinador.component';
import { DetalleEstudioCoordinadorComponent } from './detalle-estudio-coordinador/detalle-estudio-coordinador.component';

@NgModule({
  imports: [
    CommonModule,
    CoordinadorRouting,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CustomComponentsModule,
  ],
  declarations: [
    RegistroEmpresaComponent,
    ClientesComponent,
    RegistrarNuevoClienteComponent,
    EmpresasComponent,
    EmpleadosComponent,
    RegistroEmpleadoComponent,
    DisableControlDirective,
    EstudiosCoordinadorComponent,
    DetalleEstudioCoordinadorComponent,
  ],
  providers: [ClientesService, EmpleadosService, EmpresasService],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class CoordinadorModule { }