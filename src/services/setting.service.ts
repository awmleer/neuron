import {Injectable} from '@angular/core'
import {Http} from '@angular/http'
import 'rxjs/add/operator/toPromise'
import {Storage} from '@ionic/storage'
import {ToastController} from 'ionic-angular'
import {HttpClient} from '@angular/common/http'
// import * as moment from "moment"
// import * as _ from "lodash"


@Injectable()
export class SettingService {

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private toastCtrl: ToastController,
  ) {}

  settings = {
    sound: {
      // gender: 'male',
      accent: 'US',
    },
    // soundSource: 'youdao',
    impulseIntensity: 6,
    autoRead: true,
    showChineseWhenReviewing: true,
  }

  initialize(): void {
    //do something
    this.storage.get('settings').then(settings => {
      if (settings == null) {
        return
      }
      this.loadSettings(settings)
    })
  }

  loadSettings(data): void {
    for (let key in data) {
      if (this.settings.hasOwnProperty(key)) this.settings[key] = data[key]
    }
  }

  saveSettings(): void {
    this.storage.set('settings', this.settings)
  }

}
