import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// Components
import { NuevaAgendaComponent } from './nueva-agenda/nueva-agenda.component';
import { CancelarSolicitudComponent } from './cancelar-solicitud/cancelar-solicitud.component';

const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full'},
    { path: "nueva-agenda", component: NuevaAgendaComponent },
    { path: "cancelar-solicitud", component: CancelarSolicitudComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalistaRouting {}
