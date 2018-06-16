import {NgModule, ErrorHandler} from '@angular/core'
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular'
import {MyApp} from './app.component'
import {ReviewPage} from '../pages/review/review'
import {ContactPage} from '../pages/contact/contact'
import {LearnPage} from '../pages/learn/learn'
import {TabsPage} from '../pages/tabs/tabs'
import {SettingsPage} from '../pages/settings/settings'
import {HttpClientModule} from '@angular/common/http'
import {WordService} from '../services/word.service'
import {ImpulsePage} from '../pages/impulse/impulse'
import {HowManyInPipe} from '../pipes/how-many-in.pipe'
import {WordsDoneCountPipe, WordsAllDonePipe} from '../pipes/words-done.pipe'
import {TomorrowReviewPipe} from '../pipes/tomorrow-review.pipe'
import {AccountService} from '../services/account.service'
import {LoginPage} from '../pages/login/login'
import {SettingService} from '../services/setting.service'
import {DefinitionRatePipe} from '../pipes/definition-rate.pipe'
import {WarehousePage} from '../pages/warehouse/warehouse'
import {StatisticPage} from '../pages/statistic/statistic'
import {ProgressIconComponent} from '../components/progress-icon/progress-icon'
import {AboutPage} from '../pages/about/about'
import {IonicStorageModule} from '@ionic/storage'
import {BrowserModule} from '@angular/platform-browser'
import {ImpulseCardComponent} from '../components/impulse-card/impulse-card'
import {FeedbackPageModule} from '../pages/feedback/feedback.module'
import {InAppBrowser} from '@ionic-native/in-app-browser'
import {StatusBar} from '@ionic-native/status-bar'
import {SplashScreen} from '@ionic-native/splash-screen'
import {ApiService} from '../services/api.service'
import {ToastService} from '../services/toast.service'
import {BankService} from '../services/bank.service'


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
    ProgressIconComponent,
    ImpulseCardComponent,
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    BrowserModule,
    HttpClientModule,
    FeedbackPageModule,
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
    AboutPage,
  ],
  providers: [
    // {provide: ErrorHandler, useClass: IonicErrorHandler},
    SplashScreen,
    StatusBar,
    InAppBrowser,
    ApiService,
    ToastService,
    WordService,
    AccountService,
    SettingService,
    BankService,
  ],
})
export class AppModule {
}
