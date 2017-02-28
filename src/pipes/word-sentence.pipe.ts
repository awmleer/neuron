import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'wordSentence',
    pure:false
})
export class WordSentencePipe implements PipeTransform {
    transform(sentence:string,showChinese:boolean): string {
        if (showChinese) {
            return sentence;
        }else{
            return sentence.replace(/<br\/>.+/,'').replace(/<br>.+/,'');
        }
    }
}
