import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

// components
import { LoadingComponent } from "./loading/loading.component";
import { TitleComponent } from "./title/title.component";
import { MaterialModule } from '../material.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
      MaterialModule,
      CommonModule,
      RouterModule,
  ],
  exports: [LoadingComponent, TitleComponent],
  declarations: [LoadingComponent, TitleComponent],
  
})
export class CustomComponentsModule {}
