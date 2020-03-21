import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// Components
import { NuevaAgendaComponent } from './nueva-agenda/nueva-agenda.component';
import { CancelarSolicitudComponent } from './cancelar-solicitud/cancelar-solicitud.component';
import { EstudiosLogisticaComponent } from './estudios-logistica/estudios-logistica.component';
import { DetalleEstudioLogisticaSupervisorComponent } from './detalle-estudio-logistica-supervisor/detalle-estudio-logistica-supervisor.component';
import { DetalleEstudioLogisticaOrdinarioComponent } from './detalle-estudio-logistica-ordinario/detalle-estudio-logistica-ordinario.component';

const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full'},
    { path: "estudios-logistica", component: EstudiosLogisticaComponent },
    { path: "nueva-agenda", component: NuevaAgendaComponent },
    { path: "cancelar-solicitud", component: CancelarSolicitudComponent },
    { path: "detalle-estudio-supervisor/:id", component: DetalleEstudioLogisticaSupervisorComponent },
    { path: "detalle-estudio-logistica/:id", component: DetalleEstudioLogisticaOrdinarioComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LogisticaRouting {}
