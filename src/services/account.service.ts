import {Injectable} from '@angular/core';
import {RepoBrief, RepoDetail} from "../classes/repo";
import {Http} from "@angular/http";
import 'rxjs/add/operator/toPromise'
import {WordEntry, WordRecord, WordImpulsing} from "../classes/word";
import { Storage } from '@ionic/storage';
import * as moment from "moment";
import * as _ from "lodash"
import {ToastController, AlertController, LoadingController} from "ionic-angular";
import {User, LoginData} from "../classes/user";
import {WordService} from "./word.service";
import {SettingService} from "./setting.service";
import {CONST} from "../app/const";


@Injectable()
export class AccountService {
    user:User;
    syncTime:number=0;

    loading:any;

    constructor(
        private http: Http,
        private storage: Storage,
        private toastCtrl: ToastController,
        public alertCtrl: AlertController,
        private wordService: WordService,
        private settingService: SettingService,
        private loadingCtrl: LoadingController
    ) {
        this.loading = this.loadingCtrl.create({
            content: '同步中…'
        });
    }

    initialize():void{
        //first, check whether the user is logged in
        this.http.get(CONST.apiUrl+'/account/is_logged_in/')
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
        return this.http.post(CONST.apiUrl+'/account/login/', JSON.stringify({
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
        this.http.get(CONST.apiUrl+'/account/logout/').toPromise()
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
        this.http.get(CONST.apiUrl+'/account/userinfo/').toPromise()
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
        this.loading.present();
        this.http.get(CONST.apiUrl+'/sync/check/').toPromise()
            .then(response=>{
                let t=Number(response.text());
                if(t>this.syncTime){
                    this.downloadData(t);
                }else {
                    this.uploadData();
                }
            });
    }

    downloadData(timestamp:number):void{
        this.http.get(CONST.apiUrl+'/sync/download/').toPromise()
            .then(response=>{
                this.syncTime=timestamp;
                this.storage.set('syncTime',timestamp);
                let data=response.json();
                for (let key in data) {
                    this.storage.set(key,data[key]);
                }
                setTimeout(()=>{
                    this.wordService.initialize();
                    this.settingService.initialize();
                    this.loading.dismiss();
                },1000);
            });
    }

    uploadData():void{
        let length:number;
        let data={};
        this.storage.length().then(l=>{
            length=l;
            this.storage.forEach((value,key,iterationNumber)=>{
                if (key == 'syncTime') return;
                data[key]=value;
                if (iterationNumber == length) {
                    this.http.post(CONST.apiUrl+'/sync/upload/', JSON.stringify(data)).toPromise()
                        .then(response=>{
                            let timestamp=_.toSafeInteger(response.text());
                            this.storage.set('syncTime',timestamp).then(()=>{
                                this.initialize();
                                this.loading.dismiss();
                            });
                        });
                }
            });
        });
    }

}
