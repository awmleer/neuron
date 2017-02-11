import { Pipe, PipeTransform } from '@angular/core';
import {WordRecord} from "../classes/word";
import * as moment from "moment";

@Pipe({
    name: 'howManyIn',
    pure:false
})
export class HowManyIn implements PipeTransform {
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
