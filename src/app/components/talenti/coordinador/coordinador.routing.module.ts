import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RegistroEmpresaComponent } from './empresas/registro-empresa/registro-empresa.component';
import { ClientesComponent } from './clientes/clientes.component';
import { RegistrarNuevoClienteComponent } from './clientes/registrar-nuevo-cliente/registrar-nuevo-cliente.component';
import { EmpresasComponent } from './empresas/empresas.component';
import { EmpleadosComponent } from './empleados/empleados.component';
import { RegistroEmpleadoComponent } from './empleados/registro-empleado/registro-empleado.component';
import { DetalleEstudioCoordinadorComponent } from "./detalle-estudio-coordinador/detalle-estudio-coordinador.component";
import { EstudiosCoordinadorComponent } from "./estudios-coordinador/estudios-coordinador.component";


const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full'},
    { path: 'registro-empresa', component: RegistroEmpresaComponent},
    { path: 'estudios', component: EstudiosCoordinadorComponent},
    { path: 'detalle-estudio-coordinador/:id', component: DetalleEstudioCoordinadorComponent},
    {
      path: "clientes",
      children: [
        { path: "", component: ClientesComponent },
        { path: "registro-cliente", component: RegistrarNuevoClienteComponent },
        { path: "editar-cliente/:id", component: RegistrarNuevoClienteComponent }
      ]
    },
    {
      path: "empresas",
      children: [
        { path: "", component: EmpresasComponent },
        { path: "registro-empresa", component: RegistroEmpresaComponent },
        { path: "editar-empresa/:id", component: RegistroEmpresaComponent }
      ]
    },
    {
      path: "empleados",
      children: [
        { path: "", component: EmpleadosComponent },
        { path: "registro-empleado", component: RegistroEmpleadoComponent },
        { path: "editar-empleado/:id", component: RegistroEmpleadoComponent }
      ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoordinadorRouting {}
