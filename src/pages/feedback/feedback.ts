import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {InAppBrowser} from "@ionic-native/in-app-browser";



@IonicPage()
@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html',
})
export class FeedbackPage {

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      private inAppBrowser: InAppBrowser,
  ) {}

  openLink(url:string):void{
      this.inAppBrowser.create(url,'_system');
  }

}
