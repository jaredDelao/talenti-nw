import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DatosEjecutivoComponent } from "./components/talenti/ejecutivo/solicitud-estudios/datos-ejecutivo.component";
import { RegistrarNuevoClienteComponent } from "./components/talenti/coordinador/clientes/registrar-nuevo-cliente/registrar-nuevo-cliente.component";
import { RegistroEmpresaComponent } from "./components/talenti/coordinador/empresas/registro-empresa/registro-empresa.component";
import { MenuCoordinadorComponent } from "./components/talenti/coordinador/menu/menu-coordinador.component";
import { ClientesComponent } from "./components/talenti/coordinador/clientes/clientes.component";
import { EmpresasComponent } from "./components/talenti/coordinador/empresas/empresas.component";
import { EmpleadosComponent } from "./components/talenti/coordinador/empleados/empleados.component";
import { RegistroEmpleadoComponent } from "./components/talenti/coordinador/empleados/registro-empleado/registro-empleado.component";
import { MenuEjecutivoComponent } from './components/talenti/ejecutivo/menu/menu.component';
import { SolicitarEstudioComponent } from './components/talenti/ejecutivo/solicitar-estudio/solicitar-estudio.component';
import { SolicitudCancelacionComponent } from './components/talenti/ejecutivo/solicitud-cancelacion/solicitud-cancelacion.component';
import { NuevaAgendaComponent } from './components/talenti/analista/nueva-agenda/nueva-agenda.component';
import { CancelarSolicitudComponent } from './components/talenti/analista/cancelar-solicitud/cancelar-solicitud.component';

const routes: Routes = [
  { path: "", component: MenuCoordinadorComponent, pathMatch: "full" },
  { path: "coordinador",
    children: [
      // { path: "", component: MenuCoordinadorComponent },
      { path: "clientes",
        children: [
          { path: "", component: ClientesComponent },
          { path: "registro-cliente", component: RegistrarNuevoClienteComponent },
          { path: "editar-cliente/:id", component: RegistrarNuevoClienteComponent }
        ]
      },
      { path: "empresas",
        children: [
          { path: "", component: EmpresasComponent },
          { path: "registro-empresa", component: RegistroEmpresaComponent },
          { path: "editar-empresa/:id", component: RegistroEmpresaComponent }
        ]
      },
      { path: "empleados",
        children: [
          { path: "", component: EmpleadosComponent },
          { path: "registro-empleado", component: RegistroEmpleadoComponent },
          { path: "editar-empleado/:id", component: RegistroEmpleadoComponent }
        ]
      }
    ]
  },
  { path: 'ejecutivo',
    children: [
      // { path: '', component: MenuEjecutivoComponent },
      { path: "solicitud-estudios", component: DatosEjecutivoComponent },
      { path: 'solicitar-estudio', component: SolicitarEstudioComponent },
      // { path: 'validar-estudios', component: MenuEjecutivoComponent },
      // { path: 'publicar-estudios', component: MenuEjecutivoComponent },
      { path: 'solicitud-cancelacion', component: SolicitudCancelacionComponent },
      // { path: 'solicitar-calidad', component: MenuEjecutivoComponent },
    ]
  },
  { path: 'analista',
    children: [
      // { path: '', component: MenuEjecutivoComponent },
      { path: 'nueva-agenda', component: NuevaAgendaComponent },
      { path: 'cancelar-solicitud', component: CancelarSolicitudComponent },
    ]
  },
  
  { path: "**", component: MenuCoordinadorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
