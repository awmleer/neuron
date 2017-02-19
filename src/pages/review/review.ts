import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import {ImpulsePage} from "../impulse/impulse";
import {WordService} from "../../services/word.service";

import Chart from 'chart.js';
import * as moment from 'moment';

@Component({
    selector: 'page-review',
    templateUrl: 'review.html'
})
export class ReviewPage {
    @ViewChild('chartHistory') chartHistory: ElementRef;

    constructor(
        public nav: NavController,
        private wordService:WordService
    ) {}

    startReview():void{
        this.nav.push(ImpulsePage,{
            type:'review'
        })
    }

    ionViewDidEnter() {
        let d=moment();
        let dataLearn=[];
        let dataReview=[];
        let dataTotal=[];
        let labels=[];
        for (let i = 0; i < 7; i++) {
            let date=d.format('YYYY-M-D');
            console.log(date);
            labels.unshift(d.format('M-D'));
            let day=this.wordService.history[date];
            if (day) {
                dataLearn.unshift(day.learn);
                dataReview.unshift(day.review);
                dataTotal.unshift(day.learn+day.review);
            }else {
                dataLearn.unshift(0);
                dataReview.unshift(0);
                dataTotal.unshift(0);
            }
            d.subtract(1,'days');
        }
        console.log(dataLearn);
        console.log(dataReview);
        console.log(dataTotal);
        Chart.Line(this.chartHistory.nativeElement.getContext("2d"), {
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "新学",
                        fill: true,
                        beginAtZero:true,
                        cubicInterpolationMode:'default',
                        backgroundColor:'rgba(105, 189, 16, 0.2)',
                        borderColor:'rgba(105, 189, 16, 1)',
                        // backgroundColor: "rgba(75,192,192,0.4)",
                        // borderColor: "rgba(75,192,192,1)",
                        // borderCapStyle: 'butt',
                        // borderDash: [],
                        // borderDashOffset: 0.0,
                        // borderJoinStyle: 'miter',
                        // pointBorderColor: "rgba(75,192,192,1)",
                        // pointBackgroundColor: "#fff",
                        // pointBorderWidth: 1,
                        // pointHoverRadius: 5,
                        // pointHoverBackgroundColor: "rgba(75,192,192,1)",
                        // pointHoverBorderColor: "rgba(220,220,220,1)",
                        // pointHoverBorderWidth: 2,
                        // pointRadius: 1,
                        // pointHitRadius: 10,
                        data: dataLearn,
                        // spanGaps: false,
                    },
                    {
                        label: "复习",
                        fill: true,
                        beginAtZero:true,
                        lineTension: 1,
                        backgroundColor:'rgba(153, 102, 255, 0.2)',
                        borderColor:'rgba(153, 102, 255, 1)',
                        data:dataReview
                    },
                    {
                        label: "总计",
                        fill: true,
                        beginAtZero:true,
                        lineTension: 1,
                        backgroundColor:'rgba(54, 162, 235, 0.2)',
                        borderColor:'rgba(54, 162, 235, 1)',
                        data:dataTotal
                    }
                ]
            }
        });
    }

}
