import {Component, Input} from '@angular/core';
import { NavParams } from 'ionic-angular';
import { NavController } from 'ionic-angular';

// import _ from 'lodash';
import * as _ from "lodash";
// import _ from '@types/lodash'


@Component({
    selector: 'page-impulse',
    templateUrl: 'impulse.html'
})
export class ImpulsePage {

    queue:any[];
    constructor(
        public navCtrl: NavController,
        private navParams: NavParams
    ) {
        this.queue=[];
    }
    ngOnInit(): void {
        console.log(this.navParams.get('amount'));
        // console.log(_);
    }

}
