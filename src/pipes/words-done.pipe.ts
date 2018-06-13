import {Pipe, PipeTransform} from '@angular/core'

@Pipe({
  name: 'wordsDoneCount',
  pure: false,
})
export class WordsDoneCountPipe implements PipeTransform {
  transform(words: any[]): number {
    if (Object.prototype.toString.call(words) != '[object Array]') {//if `words` is not an array
      return 0
    }
    let count: number = 0
    for (let i = 0; i < words.length; i++) {
      if (words[i].wait == -1) {
        count++
      }
    }
    return count
  }
}


@Pipe({
  name: 'wordsAllDone',
  pure: false,
})
export class WordsAllDonePipe implements PipeTransform {
  transform(words: any[]): boolean {
    if (Object.prototype.toString.call(words) != '[object Array]') {//if `words` is not an array
      return true
    }
    let allDone: boolean = true
    for (let i = 0; i < words.length; i++) {
      if (words[i].wait != -1) allDone = false
    }
    return allDone
  }
}
