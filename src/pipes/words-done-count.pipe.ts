import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'wordsDoneCount',
})
export class WordsDoneCountPipe implements PipeTransform {
    transform(words: any[], hash:any): number {
        if (Object.prototype.toString.call(words)!='[object Array]') {//if `words` is not an array
            return 0;
        }
        let count:number=0;
        for (let i = 0; i < words.length; i++) {
            if (words[i].wait==-1) {
                count++;
            }
        }
        return count;
    }
}
