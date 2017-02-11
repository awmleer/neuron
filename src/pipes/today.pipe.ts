import { Pipe, PipeTransform } from '@angular/core';
import {WordRecord} from "../classes/word";

@Pipe({
    name: 'todayLearn',
    pure:false
})
export class TodayLearnPipe implements PipeTransform {
    transform(wordRecords: WordRecord[]): number {
        let count:number=0;
        for (let i = 0; i < wordRecords.length; i++) {
            count++;
        }
        return count;
    }
}
