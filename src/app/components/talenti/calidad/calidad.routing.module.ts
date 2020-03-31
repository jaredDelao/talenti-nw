import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// Components
import { EstudiosCalidadComponent } from './estudios-calidad/estudios-calidad.component';
import { DetalleEstudioCalidadComponent } from './detalle-estudio-calidad/detalle-estudio-calidad.component';

const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full'},
    { path: "estudios-calidad", component: EstudiosCalidadComponent },
    { path: "detalle-estudio-calidad/:id", component: DetalleEstudioCalidadComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalidadRouting {}
