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
import {WordsDoneCountPipe, WordsAllDonePipe} from "../pipes/words-done.pipe";
import {TomorrowReviewPipe} from "../pipes/tomorrow-review.pipe";
import {AccountService} from "../services/account.service";
import {LoginPage} from "../pages/login/login";


@NgModule({
    declarations: [
        MyApp,
        ReviewPage,
        ContactPage,
        LearnPage,
        TabsPage,
        SettingsPage,
        ImpulsePage,
        LoginPage,
        TodayLearnPipe,
        HowManyInPipe,
        WordsDoneCountPipe,
        WordsAllDonePipe,
        TomorrowReviewPipe
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
        ImpulsePage,
        LoginPage
    ],
    providers: [
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        Storage,
        WordService,
        AccountService
    ]
})
export class AppModule {}
