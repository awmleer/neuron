import { Component } from '@angular/core';

import {NavController, ModalController, ToastController} from 'ionic-angular';
import {AccountService} from "../../services/account.service";
import {LoginData} from "../../classes/user";

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {

    constructor(
        public navCtrl: NavController,
        public accountService:AccountService,
        public toastCtrl:ToastController
    ) {}

    loginData=new LoginData;

    doLogin():void{
        this.accountService.login(this.loginData).then(data=>{
            console.log(data);
            if (data == 'success') {
                this.navCtrl.pop();
                this.toastCtrl.create({
                    message:'登录成功',
                    duration:2000
                }).present();
            }else {
                this.toastCtrl.create({
                    message:'登录失败 '+data,
                    duration:2000
                }).present();
            }
        });
    }

}
