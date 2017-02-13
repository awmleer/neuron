import { Component } from '@angular/core';
import {NavController, AlertController, ToastController} from 'ionic-angular';
import {WordService} from "../../services/word.service";
import {RepoBrief, RepoDetail} from "../../classes/repo";
import {ImpulsePage} from "../impulse/impulse";
import {WordRecord} from "../../classes/word";
import * as _ from "lodash"

@Component({
    selector: 'page-learn',
    templateUrl: 'learn.html'
    // providers:[WordService]
})
export class LearnPage {
    repos: RepoDetail[]=[];
    subscriptions:any[]=[];

    constructor(
        public nav: NavController,
        public alertCtrl: AlertController,
        private wordService:WordService,
        public toastCtrl: ToastController
    ) {}

    getRepos():void{
        this.wordService.getRepos().then(repos=>{
            // this.repos=repos;
            for (let i = 0; i < repos.length; i++) {
                this.wordService.getRepo(repos[i].id).then(repo=>{
                    // repo.doHash();
                    console.log(repo);
                    this.repos.push(repo);
                });
            }
        });
    }

    startLearn(repo:RepoDetail):void{
        if (this.wordService.wordsLearning!=null) {
            let alert=this.alertCtrl.create({
                title:'提醒',
                subTitle:'您有正在进行的学习队列，是否放弃该队列并新建一个学习队列？',
                buttons:[
                    {
                        text:'取消'
                    },
                    {
                        text:'确定',
                        handler:data=>{
                            //if click yes
                            alert.dismiss().then(() => {
                                this.newLearn(repo);
                            });
                            return false;
                        }
                    }
                ]
            });
            alert.present();
        }else {
            this.newLearn(repo);
        }
    }

    newLearn(repo:RepoDetail):void{
        let alert=this.alertCtrl.create({
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
                    text: '取消'
                },
                {
                    text: '确定',
                    handler: data => {
                        let amount=_.toSafeInteger(data.amount);
                        if (amount>0) {
                            alert.dismiss().then(() => {
                                this.generateWordsLearning(repo,amount);
                                this.nav.push(ImpulsePage,{
                                    type:'learn'
                                });
                            });
                        }else {
                            this.toastCtrl.create({
                                message:'请输入一个正整数',
                                duration:2000
                            }).present();
                        }
                        return false;
                    }
                }
            ]
        });
        alert.present();
    }

    continueLearn():void{
        this.nav.push(ImpulsePage,{
            type:'learn'
        });
    }

    generateWordsLearning(repo:RepoDetail,amount:number):void{
        this.wordService.wordsLearning=[];
        let unstudied=[];
        for (let i = 0; i < repo.words.length; i++) {
            if (this.wordService.isStudied(repo.words[i])==false) {
                unstudied.push(repo.words[i]);
            }
        }
        for (let i = 0; i < amount; i++) {
            let index=Math.floor((Math.random()*unstudied.length));
            console.log(index);
            this.wordService.wordsLearning.push({
                word:unstudied[index],
                count:0,
                wait:i,
                dirty:0
            });
            unstudied.splice(index,1);
        }
    }


    ngOnInit(): void {
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
