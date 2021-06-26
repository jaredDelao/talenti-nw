import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

// components
import { LoadingComponent } from "./loading/loading.component";
import { TitleComponent } from "./title/title.component";
import { MaterialModule } from '../material.module';
import { RouterModule } from '@angular/router';
import { TablaGeneralComponent } from './tabla-general/tabla-general.component';
import { SolicitarEstudioSharedComponent } from './components/solicitar-estudio-shared/solicitar-estudio-shared.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TitleTablaComponent } from './title-tabla/title-tabla.component';
import { RevisarModalComponent } from './modals/revisar-modal/revisar-modal.component';
import { SolicitarCancelacionEmpleadoComponent } from './modals/solicitar-cancelacion-empleado/solicitar-cancelacion-empleado.component';
import { GraficasComponent } from './graficas/graficas.component';
import { ChartsModule } from 'ng2-charts';
import { TablaEstatusComponent } from './tabla-estatus/tabla-estatus.component';
import { GraficaClienteComponent } from '../components/graficas/general/grafica-cliente/grafica-cliente.component';
import { GraficaTalentiComponent } from '../components/graficas/general/grafica-talenti/grafica-talenti.component';
import { EstatusSolicitudPipe } from './pipes/estatus-solicitud.pipe';
import { VerificarPreliminarPipe } from './pipes/verificar-preliminar.pipe';
import { EstatusDictamenPipe } from './pipes/estatus-dictamen.pipe';
import { VerificarRolPipe } from './pipes/verificar-rol.pipe';
import { VerificarDictamenPipe } from './pipes/verificar-dictamen.pipe';
import { VerificarEstatusAgendaPipe } from './pipes/verificar-estatus-agenda.pipe';
import { VerificarEstatusAsignacionPipe } from './pipes/verificar-estatus-asignacion.pipe';
import { VerificarEstatusAplicacionPipe } from './pipes/verificar-estatus-aplicacion.pipe';
import { IconoPreliminarPipe } from './pipes/ejecutivo/icono-preliminar.pipe';
import { VerificarClientePipe } from './pipes/ejecutivo/verificar-cliente.pipe';
import { VerificarPagoPipe } from './pipes/verificar-pago.pipe';
import { TiempoKpisPipe } from './pipes/tiempo-kpis.pipe';
import { TiempoKpisCoordinadorPipe } from './pipes/tiempo-kpis-coordinador.pipe';

const PIPES = [
    EstatusSolicitudPipe,
    VerificarPreliminarPipe,
    EstatusDictamenPipe,
    VerificarRolPipe,
    VerificarDictamenPipe,
    VerificarEstatusAgendaPipe,
    VerificarEstatusAsignacionPipe,
    VerificarEstatusAplicacionPipe,
    IconoPreliminarPipe,
    VerificarClientePipe,
    VerificarPagoPipe,
    TiempoKpisPipe,
    TiempoKpisCoordinadorPipe,
]
@NgModule({
  imports: [
      MaterialModule,
      CommonModule,
      RouterModule,
      ReactiveFormsModule,
      FormsModule,
      ChartsModule,
  ],
  exports: [
    LoadingComponent, 
    TitleComponent, 
    TitleTablaComponent, 
    TablaGeneralComponent, 
    SolicitarEstudioSharedComponent, 
    RevisarModalComponent,
    TablaEstatusComponent,
    GraficaClienteComponent,
    GraficaTalentiComponent,
    ...PIPES,
  ],
  declarations: [
    ...PIPES,
    LoadingComponent, 
    TitleComponent, 
    TitleTablaComponent, 
    TablaGeneralComponent, 
    SolicitarEstudioSharedComponent,
    RevisarModalComponent,
    SolicitarCancelacionEmpleadoComponent,
    GraficasComponent,
    TablaEstatusComponent,
    GraficaClienteComponent,
    GraficaTalentiComponent,
  ],
  entryComponents: [
    RevisarModalComponent,
    SolicitarCancelacionEmpleadoComponent,
  ]
  
})
export class CustomComponentsModule {}
