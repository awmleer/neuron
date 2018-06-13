import {Component} from '@angular/core'

import {NavController, ModalController} from 'ionic-angular'
import {AccountService} from '../../services/account.service'
import {LoginPage} from '../login/login'
import {SettingService} from '../../services/setting.service'
import {AboutPage} from '../about/about'
import {FeedbackPage} from '../feedback/feedback'
import {InAppBrowser} from '@ionic-native/in-app-browser'

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  constructor(
    public navCtrl: NavController,
    public accountService: AccountService,
    public settingService: SettingService,
    private inAppBrowser: InAppBrowser,
    public modalCtrl: ModalController,
  ) {}

  showLoginModal(): void {
    this.modalCtrl.create(LoginPage).present()
  }

  openHelpPage(): void {
    this.inAppBrowser.create('http://neuron.sparker.top/readme.html', '_blank', 'location=no')
    // new InAppBrowser('http://neuron.sparker.top/readme.html','_blank','location=no')
  }

  openFeedbackPage(): void {
    this.navCtrl.push(FeedbackPage)
  }

  openAboutPage(): void {
    this.navCtrl.push(AboutPage)
  }

}
