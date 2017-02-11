import { Component } from '@angular/core';

import {NavController, AlertController} from 'ionic-angular';
import {WordService} from "../../services/word.service";
import {RepoBrief, RepoDetail} from "../../classes/repo";
import {ImpulsePage} from "../impulse/impulse";
import {WordRecord} from "../../classes/word";

@Component({
    selector: 'page-learn',
    templateUrl: 'learn.html'
    // providers:[WordService]
})
export class LearnPage {
    repos: RepoDetail[]=[];
    wordRecords:WordRecord[]=[];
    subscriptions:any[]=[];

    constructor(
        public nav: NavController,
        public alertCtrl: AlertController,
        private wordService:WordService
    ) {}

    getRepos():void{
        this.wordService.getRepos().then(repos=>{
            // this.repos=repos;
            for (let i = 0; i < repos.length; i++) {
                this.wordService.getRepo(repos[i].id,true).then(repo=>{
                    // repo.doHash();
                    console.log(repo);
                    this.repos.push(repo);
                });
            }
        });
    }

    startLearn(repo:RepoDetail):void{
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
                            repo:repo,
                            type:'learn',
                            continued:false
                        });
                    }
                }
            ]
        });
        prompt.present();
    }


    continueLearn():void{
        this.nav.push(ImpulsePage,{
            type:'learn',
            continued:true
        });
    }


    ngOnInit(): void {
        this.wordService.freshWordsLearning();
        this.getRepos();
    }


    ionViewWillEnter() {

    }

    ngOnDestroy() {
        // prevent memory leak when component destroyed
        for (let i = 0; i < this.subscriptions.length; i++) {
            this.subscriptions[i].unsubscribe();
        }
    }

}
