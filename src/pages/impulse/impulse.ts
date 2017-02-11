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
    currentWord:any;
    repo:RepoDetail;
    unstudied:any[]=[];
    entry:WordEntry;
    constructor(
        public nav: NavController,
        private navParams: NavParams,
        public wordService:WordService
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
                this.nextWord();
            });

        // console.log(_);
    }

    nextWord():void{
        let allDone=true;
        for (let i = 0; i < this.words.length; i++) {
            if (this.words[i].wait==0) {
                this.currentWord=this.words[i];
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
            console.log('all words are done');
            this.nav.pop();
            return;
        }
        //if all words.wait > 0
        for (let i = 0; i < this.words.length; i++) {
            if (this.words[i].wait > 0) {
                this.words[i].wait--;
            }
        }
        this.nextWord();
    }

    clickKnow():void{
        if (this.currentWord.dirty==0) {//First time today
            //if in learn mode
            //add word to records
            this.wordService.addRecord(this.currentWord.word,'know');
            this.currentWord.wait=-1;//never show this word today
        }else {
            this.currentWord.count+=1;
            if (this.currentWord.count == 6) {//if count reaches 6
                this.currentWord.wait=-1;//this word is done for today
                if (this.currentWord.dirty == 2) {
                    this.wordService.addRecord(this.currentWord.word,'vague');
                }else if (this.currentWord.dirty == 3) {
                    this.wordService.addRecord(this.currentWord.word,'forget');
                }
            }else {
                this.currentWord.wait=this.currentWord.count*2;
            }
        }
        this.nextWord();
    }

    clickVague():void{
        if (this.currentWord.dirty==0) {//First time today
            this.currentWord.count=3;
            this.currentWord.wait=2;
        }else {
            this.currentWord.wait=this.currentWord.count*2;
        }
        this.currentWord.dirty=2;
        this.nextWord();
    }

    clickForget():void{
        if (this.currentWord.dirty==0) {//First time today
            this.currentWord.count=1;
            this.currentWord.wait=2;
        }else {
            this.currentWord.count--;
            this.currentWord.wait=this.currentWord.count*2;
        }
        this.currentWord.dirty=3;
        this.nextWord();
    }

}
