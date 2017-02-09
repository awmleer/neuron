import { Component } from '@angular/core';

import {NavController, AlertController} from 'ionic-angular';
import {WordService} from "../../services/word.service";
import {RepoBrief} from "../../classes/repo";
import {ImpulsePage} from "../impulse/impulse";

@Component({
    selector: 'page-learn',
    templateUrl: 'learn.html',
    providers:[WordService]

})
export class LearnPage {
    repos: RepoBrief[];

    constructor(
        public nav: NavController,
        public alertCtrl: AlertController,
        private wordService:WordService) {

    }

    getRepos():void{
        this.wordService.getRepos().then(repos=>{
            this.repos=repos
        });
    }

    startLearn(repo):void{
        let prompt = this.alertCtrl.create({
            title: '设置',
            message: "请输入计划新学的单词个数",
            inputs: [
                {
                    name: 'amount',
                    placeholder: ''
                },
            ],
            buttons: [
                {
                    text: '取消',
                    handler: data => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: '确定',
                    handler: data => {
                        console.log(data.amount);
                        this.nav.push(ImpulsePage,{
                            amount:data.amount
                        });
                    }
                }
            ]
        });
        prompt.present();
    }

    ngOnInit(): void {
        this.getRepos();
    }

}
