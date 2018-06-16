import {Injectable} from '@angular/core'
import {RepoBrief, RepoDetail} from '../classes/repo'
import 'rxjs/add/operator/toPromise'
import {WordEntry, WordRecord, WordImpulsing} from '../classes/word'
import {Storage} from '@ionic/storage'
import * as moment from 'moment'
import * as _ from 'lodash'
import {ToastController, AlertController, LoadingController} from 'ionic-angular'
import {User, LoginData} from '../classes/user'
import {WordService} from './word.service'
import {SettingService} from './setting.service'
import {CONST} from '../app/const'
import {HttpClient} from '@angular/common/http'
import {ApiService} from './api.service'


@Injectable()
export class AccountService {
  user: User

  constructor(
    private apiSvc: ApiService,
    private toastCtrl: ToastController,
    public alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
  ) {}

  initialize(): void {
    //first, check whether the user is logged in
    this.apiSvc.get(CONST.apiUrl + '/account/is_logged_in/')
      .then(response => {
        if (response.text() == 'true') {
          this.getUserInfo()
        }
      })
  }

  async login(loginData: LoginData): Promise<void> {
    await this.apiSvc.post(CONST.apiUrl + '/account/login/', {
      phone: loginData.phone,
      password: loginData.password,
    })
    await this.getUserInfo()
  }

  async logout(): Promise<void> {
    await this.apiSvc.get('/account/logout/')
  }

  async getUserInfo(): Promise<User> {
    this.user = await this.apiSvc.get('/account/userinfo/')
    return this.user
  }

}
