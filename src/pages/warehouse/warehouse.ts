import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import {WordService} from "../../services/word.service";
import {WordRecord} from "../../classes/word";

@Component({
    selector: 'page-warehouse',
    templateUrl: 'warehouse.html'
})
export class WarehousePage {
    records:WordRecord[]=[];
    constructor(
        public navCtrl: NavController,
        private wordService:WordService
    ) {}

    ionViewDidEnter():void{
        for (let word in this.wordService.wordRecords) {
            let record=this.wordService.wordRecords[word];
            record.word=word;
            this.records.push(record);
        }
    }


}
