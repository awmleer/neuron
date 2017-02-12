import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { ReviewPage } from '../pages/review/review';
import { ContactPage } from '../pages/contact/contact';
import { LearnPage } from '../pages/learn/learn';
import { TabsPage } from '../pages/tabs/tabs';
import {SettingsPage} from "../pages/settings/settings";
import {HttpModule} from "@angular/http";
import {WordService} from "../services/word.service";
import {ImpulsePage} from "../pages/impulse/impulse";
import { Storage } from '@ionic/storage';
import {TodayLearnPipe} from "../pipes/today.pipe";
import {HowManyInPipe} from "../pipes/how-many-in.pipe";
import {WordsDoneCountPipe} from "../pipes/words-done-count.pipe";


@NgModule({
    declarations: [
        MyApp,
        ReviewPage,
        ContactPage,
        LearnPage,
        TabsPage,
        SettingsPage,
        ImpulsePage,
        TodayLearnPipe,
        HowManyInPipe,
        WordsDoneCountPipe
    ],
    imports: [
        IonicModule.forRoot(MyApp),
        HttpModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        ReviewPage,
        ContactPage,
        LearnPage,
        TabsPage,
        SettingsPage,
        ImpulsePage
    ],
    providers: [
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        Storage,
        WordService
    ]
})
export class AppModule {}
