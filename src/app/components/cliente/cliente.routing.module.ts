import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { EstudiosClienteComponent } from './estudios-cliente/estudios-cliente.component';
import { DetalleEstudioClienteComponent } from './detalle-estudio-cliente/detalle-estudio-cliente.component';
import { SolicitudEstudioClienteComponent } from './solicitud-estudio-cliente/solicitud-estudio-cliente.component';

// Components


const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full'},
    { path: "estudios-cliente", component: EstudiosClienteComponent },
    { path: "solicitar-estudio", component: SolicitudEstudioClienteComponent },
    { path: "detalle-estudio/:id", component: DetalleEstudioClienteComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClienteRouting {}
