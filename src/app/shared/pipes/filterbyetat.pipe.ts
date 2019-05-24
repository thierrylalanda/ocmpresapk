import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterbyetat', pure: false
})
export class FilterbyetatPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if(args && args==='all') {
      return value;
    } else if(args &&  args instanceof Array && value instanceof Array) {
      return value.filter(cmd=> {
        return args.includes(parseInt(cmd.etatc.code));
      });
    };
  }

}
