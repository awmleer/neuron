import {Injectable} from '@angular/core'
import {ToastController} from 'ionic-angular'


@Injectable()
export class ToastService {
  constructor(
    private toastCtrl: ToastController,
  ) {}

  toast(message: string, duration: number = 2000): void {
    this.toastCtrl.create({
      message: message,
      duration: duration,
      position: 'top',
    }).present()
  }
}
