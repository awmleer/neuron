import { Component } from '@angular/core';
import {Config, Platform} from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { TabsPage } from '../pages/tabs/tabs';
import {WordService} from "../services/word.service";
import {AccountService} from "../services/account.service";
import {SettingService} from "../services/setting.service";


@Component({
    templateUrl: 'app.html'
})


export class MyApp {
    rootPage = TabsPage;

    constructor(
        platform: Platform,
        wordService:WordService,
        accountService:AccountService,
        config: Config,
        settingService:SettingService
    ) {
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();
            setTimeout(()=>{
                Splashscreen.hide()
            },500);
        });
        config.set('ios','backButtonText','返回');
        wordService.initialize();
        accountService.initialize();
        settingService.initialize();
    }

}
