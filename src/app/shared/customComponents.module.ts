import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

// components
import { LoadingComponent } from "./loading/loading.component";
import { TitleComponent } from "./title/title.component";
import { MaterialModule } from '../material.module';
import { RouterModule } from '@angular/router';
import { TablaGeneralComponent } from './tabla-general/tabla-general.component';

@NgModule({
  imports: [
      MaterialModule,
      CommonModule,
      RouterModule,
  ],
  exports: [LoadingComponent, TitleComponent, TablaGeneralComponent],
  declarations: [LoadingComponent, TitleComponent, TablaGeneralComponent],
  
})
export class CustomComponentsModule {}
