import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterincident', pure: false
})
export class FilterIncidentPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if(args && args==='all') {
      return value;
    } else if(args &&  args instanceof Array && value instanceof Array) {
      return value.filter(inc=> {
        return args.includes(parseInt(inc.state.code));
      });
    };
  }

}
