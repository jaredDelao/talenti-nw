import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// Components
import { EstudiosAnalistaComponent } from './estudios-analista/estudios-analista.component';
import { DetalleEstudioAnalistaComponent } from './detalle-estudio-analista/detalle-estudio-analista.component';

const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full'},
    { path: "estudios", component: EstudiosAnalistaComponent },
    { path: "detalle-estudio-analista/:id", component: DetalleEstudioAnalistaComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalistaRouting {}
