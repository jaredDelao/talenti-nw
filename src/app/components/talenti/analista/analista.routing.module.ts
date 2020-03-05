import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// Components
import { EstudiosAnalistaComponent } from './estudios-analista/estudios-analista.component';

const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full'},
    { path: "detalle-estudio", component: EstudiosAnalistaComponent },  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalistaRouting {}
