import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { LearnPage } from '../pages/learn/learn';
import { TabsPage } from '../pages/tabs/tabs';
import {SettingsPage} from "../pages/settings/settings";
import {HttpModule} from "@angular/http";
import {WordService} from "../services/word.service";
import {ImpulsePage} from "../pages/impulse/impulse";


@NgModule({
    declarations: [
        MyApp,
        AboutPage,
        ContactPage,
        LearnPage,
        TabsPage,
        SettingsPage,
        ImpulsePage
    ],
    imports: [
        IonicModule.forRoot(MyApp),
        HttpModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        AboutPage,
        ContactPage,
        LearnPage,
        TabsPage,
        SettingsPage,
        ImpulsePage
    ],
    providers: [
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        WordService
    ]
})
export class AppModule {}
