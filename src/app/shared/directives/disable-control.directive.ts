import { Directive, Input } from '@angular/core';
import { NgControl, Validators } from '@angular/forms';

@Directive({
  selector: '[disableControl]'
})
export class DisableControlDirective {

  @Input() set disableControl( condition : boolean ) {
    if (condition == true) {
      this.ngControl.control.setValidators([Validators.required]);
      this.ngControl.control.updateValueAndValidity({emitEvent: false})
    } else {
      this.ngControl.control.clearValidators();
      this.ngControl.control.updateValueAndValidity({emitEvent: false})
    }
  }

  constructor(private ngControl: NgControl) { }

}
