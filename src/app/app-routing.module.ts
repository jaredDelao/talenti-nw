import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PagesComponent } from "./components/pages/pages.component";
import { LoginComponent } from "./components/login/login.component";
import { DetalleEstudioClienteComponent } from './components/cliente/detalle-estudio-cliente/detalle-estudio-cliente.component';
import { SolicitudEstudioClienteComponent } from './components/cliente/solicitud-estudio-cliente/solicitud-estudio-cliente.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginGuard } from './guards/login.guard';
import { EstudiosClienteComponent } from './components/cliente/estudios-cliente/estudios-cliente.component';

const routes: Routes = [
  // { path: "", component: MenuCoordinadorComponent, pathMatch: "full" },
  { path: "login", component: LoginComponent },
  {
    path: "",
    component: PagesComponent,
    canActivate: [LoginGuard],
    children: [
      // { path: 'dashboard', redirectTo: '/dashboard', pathMatch: 'full'},
      { path: "dashboard", component: DashboardComponent},
      {
        path: "coordinador",
        loadChildren: './components/talenti/coordinador/coordinador.module#CoordinadorModule'
      },
      {
        path: "ejecutivo",
        loadChildren: './components/talenti/ejecutivo/ejecutivo.module#EjecutivoModule'
      },
      {
        path: "logistica",
        loadChildren: './components/talenti/logistica/logistica.module#LogisticaModule'
      },
      {
        path: "cliente",
        loadChildren: './components/cliente/cliente.module#ClienteModule'
        // children: [
          // { path: "detalle-estudio", component: DetalleEstudioClienteComponent },
          // { path: "detalle-estudio", component: EstudiosClienteComponent },
          // { path: "solicitud-estudio", component: SolicitudEstudioClienteComponent }
        // ]
      },
      {
        path: "analista",
        loadChildren: './components/talenti/analista/analista.module#AnalistaModule'
      },
      { path: "**", redirectTo: '/dashboard' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
