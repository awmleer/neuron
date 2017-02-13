import { Component } from '@angular/core';

import {NavController, ModalController} from 'ionic-angular';
import {AccountService} from "../../services/account.service";

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {

    constructor(
        public navCtrl: NavController,
        public accountService:AccountService
    ) {

    }


}
