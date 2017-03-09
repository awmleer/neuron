import { Component } from '@angular/core';

import {NavController, ModalController} from 'ionic-angular';
import {AccountService} from "../../services/account.service";
import {LoginPage} from "../login/login";
import {SettingService} from "../../services/setting.service";
import {InAppBrowser} from "ionic-native";

@Component({
    selector: 'page-settings',
    templateUrl: 'settings.html'
})
export class SettingsPage {

    constructor(
        public navCtrl: NavController,
        public accountService:AccountService,
        public settingService: SettingService,
        public modalCtrl: ModalController
    ) {
        // this.scaleChange();
    }

    showLoginModal():void{
        this.modalCtrl.create(LoginPage).present();
    }

    openHelpPage():void{
        new InAppBrowser('http://neuron.sparker.top/readme.html','_blank','location=no');
    }

    // scaleChange():void{
    //     let s:number;
    //     this.settingService.saveSettings();
    //     switch(this.settingService.settings.scale){
    //         case 1: s=0.9;break;
    //         case 2: s=0.95;break;
    //         case 3: s=1.0;break;
    //         case 4: s=1.05;break;
    //         case 5: s=1.1;break;
    //         default: s=1.0;break;
    //     }
    //     (<HTMLMetaElement>document.getElementsByTagName('meta')['viewport']).content=`width=device-width, initial-scale=${s}, minimum-scale=${s}, maximum-scale=${s}, user-scalable=no`;
    // }

}
