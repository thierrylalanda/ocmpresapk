import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'help'
})
export class HelpPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}
