import { Component } from '@angular/core';

import {NavController, AlertController} from 'ionic-angular';
import {WordService} from "../../services/word.service";
import {RepoBrief} from "../../classes/repo";
import {ImpulsePage} from "../impulse/impulse";
import {WordRecord} from "../../classes/word";

@Component({
    selector: 'page-learn',
    templateUrl: 'learn.html'
    // providers:[WordService]
})
export class LearnPage {
    repos: RepoBrief[];
    wordRecords:WordRecord[]=[];
    subscriptions:any[]=[];

    constructor(
        public nav: NavController,
        public alertCtrl: AlertController,
        public wordService:WordService
    ) {
        // this.wordRecords=this.wordService.getWordRecords();
        // this.subscriptions[0]=wordService.wordRecords$.subscribe(wordRecords=>{
        //     this.wordRecords=wordRecords;
        //     console.log('get it!!!');
        // });
    }

    getRepos():void{
        this.wordService.getRepos().then(repos=>{
            this.repos=repos
        });
    }

    test():void{
        console.log(this.wordService);
    }

    startLearn(repo:RepoBrief):void{
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
                            amount:data.amount,
                            repo:repo
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


    ionViewWillEnter() {
        console.log('view enter');
        this.wordRecords=this.wordService.wordRecords;
        console.log(this.wordRecords);
    }

    ngOnDestroy() {
        // prevent memory leak when component destroyed
        for (let i = 0; i < this.subscriptions.length; i++) {
            this.subscriptions[i].unsubscribe();
        }
    }

}
