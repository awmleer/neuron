import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import {AccountService} from "../../services/account.service";

@Component({
    selector: 'page-settings',
    templateUrl: 'settings.html'
})
export class SettingsPage {

    constructor(
        public navCtrl: NavController,
        public accountService:AccountService
    ) {

    }

    setting={
        scale:3
    };

    scaleChange():void{
        let s:number;
        switch(this.setting.scale){
            case 1: s=0.9;break;
            case 2: s=0.95;break;
            case 3: s=1.0;break;
            case 4: s=1.05;break;
            case 5: s=1.1;break;
            default: s=1.0;break;
        }
        (<HTMLMetaElement>document.getElementsByTagName('meta')['viewport']).content=`width=device-width, initial-scale=${s}, minimum-scale=${s}, maximum-scale=${s}, user-scalable=no`;
    }

}
