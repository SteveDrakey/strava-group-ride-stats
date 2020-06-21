import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'delimiter'
})
export class DelimiterPipe implements PipeTransform {
  transform(value: string, delimiter: string, isLast: boolean)  {
    return !isLast ? value + delimiter : value;
  }
}
