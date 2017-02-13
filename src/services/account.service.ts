import { Injectable } from '@angular/core';
import {RepoBrief, RepoDetail} from "../classes/repo";
import {Http} from "@angular/http";
import 'rxjs/add/operator/toPromise'
import {WordEntry, WordRecord, WordImpulsing} from "../classes/word";
import { Storage } from '@ionic/storage';
import * as moment from "moment";
import * as _ from "lodash"
import {ToastController} from "ionic-angular";


@Injectable()
export class AccountService {

    user:any;

    constructor(
        private http: Http,
        private storage: Storage,
        private toastCtrl: ToastController
    ) {}

    initialize():void{

    }

    login():void{

    }

    logout():void{
        this.http.get('/api/account/logout/')
            .toPromise()
            .then(response=>{
                if (response.toString() == 'success') {
                    this.user=null;
                    this.toastCtrl.create({
                        message:'已退出登录',
                        duration:2000
                    }).present();
                }
            });
    }

}
