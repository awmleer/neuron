import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { LearnPage } from '../pages/learn/learn';
import { TabsPage } from '../pages/tabs/tabs';
import {SettingsPage} from "../pages/settings/settings";


@NgModule({
    declarations: [
        MyApp,
        AboutPage,
        ContactPage,
        LearnPage,
        TabsPage,
        SettingsPage
    ],
    imports: [
        IonicModule.forRoot(MyApp)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        AboutPage,
        ContactPage,
        LearnPage,
        TabsPage,
        SettingsPage
    ],
    providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
