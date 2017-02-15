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
import {AccountService} from "./account.service";
import {WordService} from "./word.service";


@Injectable()
export class SettingService {

    constructor(
        private http: Http,
        private accountService: AccountService,
        private wordService: WordService,
        private storage: Storage,
        private toastCtrl: ToastController
    ) {}

    settings={
        scale:3
    };

    initialize():void{
        //do something
        this.storage.get('settings').then(settings=>{
            if (settings == null) {
                return;
            }
            this.loadSettings(settings);
        });
    }

    loadSettings(data):void{
        for (let key in data) {
            this.settings[key]=data[key];
        }
    }

    saveSettings():void{
        this.storage.set('settings',this.settings);
    }

}
