import { Pipe, PipeTransform } from '@angular/core';
import * as _ from "lodash"
import {WordImpulsing} from "../classes/word";

@Pipe({
    name: 'impulsePercent',
    pure:false
})
export class ImpulsePercentPipe implements PipeTransform {
    transform(wordsImpulsing:WordImpulsing[]):string {
        let total=wordsImpulsing.length*6;
        let finished=0;
        for (let word in wordsImpulsing) {
            if (wordsImpulsing[word].wait == -1) {
                finished+=6;
            }else {
                finished+=wordsImpulsing[word].count;
            }
        }
        return (Math.round(finished/total*100) + "%");
    }
}
