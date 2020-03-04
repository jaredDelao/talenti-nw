import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DatosEjecutivoComponent } from './solicitud-estudios/datos-ejecutivo.component';
import { SolicitarEstudioComponent } from './solicitar-estudio/solicitar-estudio.component';
import { SolicitudCancelacionComponent } from './solicitud-cancelacion/solicitud-cancelacion.component';
import { DetalleEstudioEjecutivoComponent } from './detalle-estudio-ejecutivo/detalle-estudio-ejecutivo.component';

const routes: Routes = [
  { path: "", redirectTo: "/dashboard", pathMatch: "full" },
  { path: "estudios", component: DatosEjecutivoComponent },
  { path: "solicitar-estudio", component: SolicitarEstudioComponent },
  { path: "solicitud-cancelacion", component: SolicitudCancelacionComponent },
  { path: "detalle-estudio/:id", component: DetalleEstudioEjecutivoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EjecutivoRouting {}
