import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'iconoPreliminar'
})
export class IconoPreliminarPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    switch(value) {
      case '0':
        return 'not_interested';
      case '1':
        return 'pending_actions';
      case '2':
        return 'assignment'
      case '3':
        return 'assignment_turned_in';
      case '4':
        return 'error';
    }
  }

}
