import { Pipe, PipeTransform } from '@angular/core';
import { htmlAstToRender3Ast } from '@angular/compiler/src/render3/r3_template_transform';

@Pipe({
  name: 'space'
})
export class SpacePipe implements PipeTransform {

  transform(value: string)  {
    return value.replace(/ /g, '&nbsp');
  }

}
