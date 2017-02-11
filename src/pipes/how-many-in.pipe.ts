import { Pipe, PipeTransform } from '@angular/core';
import {WordRecord} from "../classes/word";

@Pipe({
    name: 'howManyIn',
    pure:false
})
export class HowManyInPipe implements PipeTransform {
    transform(wordRecords: WordRecord[], hash:any): number {
        let count:number=0;
        for (let i = 0; i < wordRecords.length; i++) {
            if (typeof hash[wordRecords[i].word] != 'undefined') {
                count++;
            }
        }
        return count;
    }
}
