import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { EstudiosClienteComponent } from './estudios-cliente/estudios-cliente.component';

// Components


const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full'},
    { path: "detalle-estudio", component: EstudiosClienteComponent },  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClienteRouting {}
