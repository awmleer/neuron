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
import {HowManyInPipe} from "../pipes/how-many-in.pipe";
import {WordsDoneCountPipe, WordsAllDonePipe} from "../pipes/words-done.pipe";
import {TomorrowReviewPipe} from "../pipes/tomorrow-review.pipe";
import {AccountService} from "../services/account.service";
import {LoginPage} from "../pages/login/login";
import {SettingService} from "../services/setting.service";
import {DefinitionRatePipe} from "../pipes/definition-rate.pipe";
import {ImpulsePercentPipe} from "../pipes/impulse-percent";
import {WarehousePage} from "../pages/warehouse/warehouse";
import {StatisticPage} from "../pages/statistic/statistic";
import {ProgressIconComponent} from "../components/progress-icon/progress-icon";
import {WordSentencePipe} from "../pipes/word-sentence.pipe";
import {AboutPage} from "../pages/about/about";
import {IonicStorageModule} from "@ionic/storage";
import {BrowserModule} from "@angular/platform-browser";


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
        WarehousePage,
        StatisticPage,
        AboutPage,
        HowManyInPipe,
        WordsDoneCountPipe,
        WordsAllDonePipe,
        TomorrowReviewPipe,
        DefinitionRatePipe,
        ImpulsePercentPipe,
        WordSentencePipe,
        ProgressIconComponent
    ],
    imports: [
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot(),
        BrowserModule,
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
        LoginPage,
        WarehousePage,
        StatisticPage,
        AboutPage
    ],
    providers: [
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        WordService,
        AccountService,
        SettingService
    ]
})
export class AppModule {}
