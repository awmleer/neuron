import {Component} from '@angular/core'

import {NavController, ModalController} from 'ionic-angular'
import {AccountService} from '../../services/account.service'
import {LoginPage} from '../login/login'
import {SettingService} from '../../services/setting.service'
import {AboutPage} from '../about/about'
import {FeedbackPage} from '../feedback/feedback'
import {InAppBrowser} from '@ionic-native/in-app-browser'
import {ToastService} from '../../services/toast.service'

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  constructor(
    public navCtrl: NavController,
    public accountSvc: AccountService,
    public settingSvc: SettingService,
    private inAppBrowser: InAppBrowser,
    public modalCtrl: ModalController,
    private toastSvc: ToastService,
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

  async logout(): Promise<void> {
    await this.accountSvc.logout()
    this.toastSvc.toast('已退出登录')
  }

}
