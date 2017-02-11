import { Pipe, PipeTransform } from '@angular/core';
import {WordRecord} from "../classes/word";
import * as moment from "moment";
import Moment = moment.Moment;

@Pipe({
    name: 'todayLearn',
    pure:false
})
export class TodayLearnPipe implements PipeTransform {
    transform(wordRecords: WordRecord[]): number {
        let count:number=0;
        for (let i = 0; i < wordRecords.length; i++) {
            if (moment(wordRecords[i].addTime).isSame(moment(),'day')) {
                count++;
            }
        }
        return count;
    }
}
