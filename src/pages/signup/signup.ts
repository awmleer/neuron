import {Component} from '@angular/core'

import {NavController, ModalController, ToastController} from 'ionic-angular'
import {AccountService} from '../../services/account.service'
import {LoginData} from '../../classes/user'
import {ToastService} from '../../services/toast.service'
import {ApiError} from '../../classes/error'


@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  constructor(
    public navCtrl: NavController,
    public accountSvc: AccountService,
    private toastSvc: ToastService,
  ) {}

  data = {
    username: '',
    password: '',
    nickname: ''
  }

  async submit(): Promise<void> {
    await this.accountSvc.signup(this.data)
    this.toastSvc.toast('注册成功')
    this.navCtrl.pop()
  }

}
