import {Pipe, PipeTransform} from '@angular/core'

@Pipe({
  name: 'tomorrowReviewPipe',
  pure: false,
})
export class TomorrowReviewPipe implements PipeTransform {
  transform(wordRecords): number {
    let count: number = 0
    for (let word in wordRecords) {
      if (wordRecords[word].wait == 1) {
        count++
      }
    }
    return count
  }
}
