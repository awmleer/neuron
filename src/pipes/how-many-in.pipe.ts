import {Pipe, PipeTransform} from '@angular/core'
import {WordRecord} from '../classes/word'

@Pipe({
  name: 'howManyIn',
  pure: false,
})
export class HowManyInPipe implements PipeTransform {
  transform(words: string[], wordRecords: any): number {
    let count: number = 0
    for (let i = 0; i < words.length; i++) {
      if (typeof wordRecords[words[i]] != 'undefined') {
        count++
      }
    }
    return count
  }
}
