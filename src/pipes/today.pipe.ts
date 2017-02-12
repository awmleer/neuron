import { Pipe, PipeTransform } from '@angular/core';
import {WordRecord} from "../classes/word";
import * as moment from "moment";

@Pipe({
    name: 'todayLearn',
    pure:false
})
export class TodayLearnPipe implements PipeTransform {
    transform(wordRecords): number {
        let count:number=0;
        for (let word in wordRecords) {
            if (moment(wordRecords[word].addTime).isSame(moment(),'day')) {
                count++;
            }
        }
        return count;
    }
}
