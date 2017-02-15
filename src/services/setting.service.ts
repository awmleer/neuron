import { Injectable } from '@angular/core';
import {Http} from "@angular/http";
import 'rxjs/add/operator/toPromise'
import { Storage } from '@ionic/storage';
import * as moment from "moment";
import * as _ from "lodash"
import {ToastController} from "ionic-angular";


@Injectable()
export class SettingService {

    constructor(
        private http: Http,
        private storage: Storage,
        private toastCtrl: ToastController
    ) {}

    settings={
        scale:3,
        sound:{
            gender:'male',
            accent:'US'
        }
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
