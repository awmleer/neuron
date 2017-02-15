import { Injectable } from '@angular/core';
import {RepoBrief, RepoDetail} from "../classes/repo";
import {Http} from "@angular/http";
import 'rxjs/add/operator/toPromise'
import {WordEntry, WordRecord, WordImpulsing} from "../classes/word";
import { Storage } from '@ionic/storage';
import * as moment from "moment";
import * as _ from "lodash"
import {ToastController, AlertController} from "ionic-angular";
import {User, LoginData} from "../classes/user";


@Injectable()
export class AccountService {

    user:User;
    syncTime:number=0;

    constructor(
        private http: Http,
        private storage: Storage,
        private toastCtrl: ToastController,
        public alertCtrl: AlertController
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
        this.storage.get('syncTime').then(time=>{
            if (time) {
                this.syncTime=time;
            }
        })
    }

    login(loginData:LoginData):Promise<any>{
        return this.http.post('/api/account/login/', JSON.stringify({
            phone:loginData.phone,
            password:loginData.password
        })).toPromise()
            .then(response=>{
                let data=response.text();
                if (data == 'success') {
                    this.getUserInfo();
                }
                return data;
            });
    }

    logout():void{
        this.http.get('/api/account/logout/').toPromise()
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
        this.http.get('/api/account/userinfo/').toPromise()
            .then(response=>{
                this.user=response.json();
            });
    }


    syncData():void{
        if (this.user == null) {
            this.alertCtrl.create({
                title:'未登录',
                subTitle:'请先登录账号再进行同步数据',
                buttons:[{text:'确定'}]
            }).present();
            return;
        }
        this.http.get('/api/sync/check/').toPromise()
            .then(response=>{
                let t=Number(response.text());
                if(t>this.syncTime){
                    this.downloadData();
                }else {
                    this.uploadData();
                }
            });
    }

    downloadData():void{

    }

    uploadData():void{

    }

}
