import { Injectable } from '@angular/core';
import {RepoBrief, RepoDetail} from "../classes/repo";
import {Http} from "@angular/http";
import 'rxjs/add/operator/toPromise'
import {WordEntry, WordRecord, WordImpulsing} from "../classes/word";
import { Storage } from '@ionic/storage';
import * as moment from "moment";
import * as _ from "lodash"
import {ToastController} from "ionic-angular";
import {User, LoginData} from "../classes/user";


@Injectable()
export class AccountService {

    user:User;

    constructor(
        private http: Http,
        private storage: Storage,
        private toastCtrl: ToastController
    ) {}

    initialize():void{
        //first, check whether the user is logged in
        this.http.get('/api/account/is_logged_in/')
            .toPromise()
            .then(response=>{
                if (response.text() == 'true') {
                    this.getUserInfo();
                }
            });
    }

    login(loginData:LoginData):Promise<any>{
        return this.http.post('/api/account/login/', JSON.stringify({
            phone:loginData.phone,
            password:loginData.password
        }))
            .toPromise()
            .then(response=>{
                let data=response.text();
                if (data == 'success') {
                    this.getUserInfo();
                }
                return data;
            });
    }

    logout():void{
        this.http.get('/api/account/logout/')
            .toPromise()
            .then(response=>{
                if (response.text() == 'success') {
                    this.user=null;
                    this.toastCtrl.create({
                        message:'已退出登录',
                        duration:2000
                    }).present();
                }
            });
    }

    getUserInfo():void{
        this.http.get('/api/account/userinfo/')
            .toPromise()
            .then(response=>{
                this.user=response.json();
            });
    }

}
