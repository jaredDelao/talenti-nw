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

@NgModule({
  imports: [
      MaterialModule,
      CommonModule,
      RouterModule,
      ReactiveFormsModule,
      FormsModule,
  ],
  exports: [LoadingComponent, TitleComponent, TitleTablaComponent, TablaGeneralComponent, SolicitarEstudioSharedComponent, RevisarModalComponent],
  declarations: [
    LoadingComponent, 
    TitleComponent, 
    TitleTablaComponent, 
    TablaGeneralComponent, 
    SolicitarEstudioSharedComponent,
    RevisarModalComponent,
  ],
  entryComponents: [
    RevisarModalComponent,
  ]
  
})
export class CustomComponentsModule {}
