import {Component} from '@angular/core'

import {NavController, ModalController, ToastController} from 'ionic-angular'
import {AccountService} from '../../services/account.service'
import {LoginData} from '../../classes/user'
import {ToastService} from '../../services/toast.service'
import {ApiError} from '../../classes/error'


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(
    public navCtrl: NavController,
    public accountSvc: AccountService,
    private toastSvc: ToastService,
  ) {}

  loginData = new LoginData()

  async doLogin(): Promise<void> {
    await this.accountSvc.login(this.loginData)
    this.toastSvc.toast('登录成功')
  }

}
