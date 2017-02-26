import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import {ImpulsePage} from "../impulse/impulse";
import {WordService} from "../../services/word.service";

import Chart from 'chart.js';
import * as moment from 'moment';
import {WarehousePage} from "../warehouse/warehouse";
import {StatisticPage} from "../statistic/statistic";

@Component({
    selector: 'page-review',
    templateUrl: 'review.html'
})
export class ReviewPage {

    constructor(
        public nav: NavController,
        private wordService:WordService
    ) {}

    startReview():void{
        this.nav.push(ImpulsePage,{
            type:'review'
        });
    }

    goWarehouse():void{
        this.nav.push(WarehousePage);
    }
    goStatistic():void{
        this.nav.push(StatisticPage);
    }
}
