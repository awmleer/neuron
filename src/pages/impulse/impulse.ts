import {Component} from '@angular/core';
import { NavParams } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import {RepoDetail} from "../../classes/repo";
import {WordService} from "../../services/word.service";
import {WordEntry} from "../../classes/word";


@Component({
    selector: 'page-impulse',
    templateUrl: 'impulse.html'
})
export class ImpulsePage {
    amount:number;
    words:any[]=[];
    currentIndex:number;
    repo:RepoDetail;
    unstudied:any[]=[];
    entry:WordEntry;
    constructor(
        public navCtrl: NavController,
        private navParams: NavParams,
        private wordService:WordService
    ) {}

    ngOnInit(): void {
        this.amount=this.navParams.get('amount');
        this.wordService.getRepo(this.navParams.get('repo').id)
            .then(repo=>{
                this.repo=repo;
                for (let i = 0; i < repo.words.length; i++) {
                    if (this.wordService.isStudied(repo.words[i])==false) {
                        this.unstudied.push(repo.words[i]);
                    }
                }
                for (let i = 0; i < this.amount; i++) {
                    this.words.push({
                        word:this.unstudied.shift(),
                        count:0,
                        wait:i,
                        dirty:0
                    });
                }
                this.nextLoop();
            });

        // console.log(_);
    }

    nextLoop():void{
        let allDone=true;
        for (let i = 0; i < this.words.length; i++) {
            if (this.words[i].wait==0) {
                this.currentIndex=i;
                this.wordService.getEntry(this.words[i].word)
                    .then(entry=>{
                        this.entry=entry;
                    });
                return;
            }else {
                if(this.words[i].wait!=-1)allDone=false;
            }
        }
        if (allDone) {
            //todo do something
            return;
        }
        for (let i = 0; i < this.words.length; i++) {
            if (this.words[i].wait > 0) {
                this.words[i].wait--;
            }
        }
    }

    clickKnow():void{

    }

    clickVague():void{

    }

    clickForget():void{

    }

}
