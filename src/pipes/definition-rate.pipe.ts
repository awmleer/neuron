import {Pipe, PipeTransform} from '@angular/core'
import * as _ from 'lodash'

@Pipe({
  name: 'definitionRate',
  pure: false,
})
export class DefinitionRatePipe implements PipeTransform {
  transform(obj): any[] {
    let rates = []
    for (let key in obj) {
      rates.push(obj[key])
    }
    return _.sortBy(rates, ['-percent'])
  }
}
