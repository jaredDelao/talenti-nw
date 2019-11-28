import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DatosEjecutivoComponent } from './components/ejecutivos/solicitud-estudios/datos-ejecutivo.component';
import { RegistrarNuevoClienteComponent } from './components/ejecutivos/registrar-nuevo-cliente/registrar-nuevo-cliente.component';
import { RegistroEmpresaComponent } from './components/talenti/coordinador/registro-empresa/registro-empresa.component';

const routes: Routes = [
  {path: 'solicitud-estudios', component: DatosEjecutivoComponent},
  {path: 'registrar-cliente', component: RegistrarNuevoClienteComponent},
  {path: 'registro-empresa', component: RegistroEmpresaComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
