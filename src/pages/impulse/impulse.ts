import {Component, NgZone} from '@angular/core';
import {NavParams, ActionSheetController} from 'ionic-angular';
import { NavController } from 'ionic-angular';
import {RepoDetail} from "../../classes/repo";
import {WordService} from "../../services/word.service";
import {WordEntry, WordImpulsing} from "../../classes/word";
import {SettingService} from "../../services/setting.service";


@Component({
    selector: 'page-impulse',
    templateUrl: 'impulse.html'
})
export class ImpulsePage {
    amount:number;
    wordsImpulsing:WordImpulsing[];
    currentWord:any;
    baffleShowing:boolean=true;
    type:string;
    entry:WordEntry;
    constructor(
        public nav: NavController,
        private navParams: NavParams,
        public wordService:WordService,
        public settingService: SettingService,
        public actionSheetCtrl:ActionSheetController,
        private zone: NgZone
    ) {
        zone.run(()=>this.baffleShowing=true);
    }

    ngOnInit(): void {
        this.type=this.navParams.get('type');
        if (this.type == 'learn') {
            this.wordsImpulsing=this.wordService.wordsLearning;
        }else if (this.type == 'review') {
            this.wordsImpulsing=this.wordService.wordsReviewing;
        }
        this.amount=this.wordsImpulsing.length;
        this.nextWord();
    }

    nextWord():void{
        let allDone=true;
        for (let i = 0; i < this.wordsImpulsing.length; i++) {
            if (this.wordsImpulsing[i].wait==0) {
                this.currentWord=this.wordsImpulsing[i];
                this.baffleShowing=true;
                this.wordService.getEntry(this.wordsImpulsing[i].word)
                    .then(entry=>{
                        this.entry=entry;
                    });
                //saveWordsImpulsing every time we get a new currentWord
                this.wordService.saveWordsImpulsing(this.type);
                return;
            }else {
                if(this.wordsImpulsing[i].wait!=-1)allDone=false;
            }
        }
        if (allDone) {
            console.log('all words are done');
            this.finish();
            return;
        }
        //if all wordImpulsing.wait > 0
        for (let i = 0; i < this.wordsImpulsing.length; i++) {
            if (this.wordsImpulsing[i].wait > 0) {
                this.wordsImpulsing[i].wait--;
            }
        }
        this.nextWord();
    }

    finish():void{
        if (this.type == 'learn') {
            this.wordService.removeWordsLearning();
        }else if (this.type == 'review') {
            this.wordService.saveWordsImpulsing(this.type);
        }
        this.nav.pop();
    }

    clickKnow():void{
        if (this.currentWord.dirty==0) {//First time today
            this.currentWord.dirty=1;
            this.currentWord.wait=-1;//never show this word today
            if(this.type=='learn')this.wordService.addRecord(this.currentWord.word,'know');
            if(this.type=='review')this.wordService.moltRecord(this.currentWord.word,'know');
        }else {
            this.currentWord.count+=1;
            if (this.currentWord.count == 6) {//if count reaches 6
                this.currentWord.wait=-1;//this word is done for today
                if (this.currentWord.dirty == 2) {
                    if(this.type=='learn')this.wordService.addRecord(this.currentWord.word,'vague');
                    if(this.type=='review')this.wordService.moltRecord(this.currentWord.word,'vague');
                }else if (this.currentWord.dirty == 3) {
                    if(this.type=='learn')this.wordService.addRecord(this.currentWord.word,'forget');
                    if(this.type=='review')this.wordService.moltRecord(this.currentWord.word,'forget');
                }
            }else {
                this.currentWord.wait=this.currentWord.count*2+1;
            }
        }
        this.nextWord();
    }

    clickVague():void{
        if (this.currentWord.dirty==0) {//First time today
            this.currentWord.count=3;
            this.currentWord.wait=2;
            this.currentWord.dirty=2;
        }else {
            //currentWord.count do not change
            this.currentWord.wait=this.currentWord.count*2+1;
        }
        this.nextWord();
    }

    clickForget():void{
        if (this.currentWord.dirty==0) {//First time today
            this.currentWord.count=1;
            this.currentWord.wait=2;
            this.currentWord.dirty=3;
        }else {
            if(this.currentWord.count>0)this.currentWord.count--;
            this.currentWord.wait=this.currentWord.count*2+1;
        }
        this.nextWord();
    }

    markAsMaster():void{
        if(this.type=='learn')this.wordService.addRecord(this.currentWord.word,'master');
        if(this.type=='review')this.wordService.moltRecord(this.currentWord.word,'master');
        this.currentWord.wait=-1;//never show it today
        this.currentWord.dirty=4;
        this.nextWord();
    }

    hideBaffle():void{
        // this.zone.run(()=>this.baffleShowing=false);
        this.baffleShowing=false;
        if (this.settingService.settings.autoRead) {
            this.playSound();
        }
    }

    playSound():void{
        (<HTMLAudioElement>document.getElementById("word-sound")).play();
    }


    starSentence(i):void{
        if (this.wordService.starredSentences[this.currentWord.word]==null) {
            this.wordService.starredSentences[this.currentWord.word]=[i];
        }else {
            this.wordService.starredSentences[this.currentWord.word].push(i);
        }
        this.wordService.saveStarredSentences();
    }
    unstarSentence(i):void{
        let index=this.wordService.starredSentences[this.currentWord.word].indexOf(i);
        this.wordService.starredSentences[this.currentWord.word].splice(index,1);
        this.wordService.saveStarredSentences();
    }


    showActionSheet():void{
        let actionSheet=this.actionSheetCtrl.create({
            title:'更多操作',
            buttons:[
                {
                    text:`当前队列：共${this.amount}个单词`
                },
                {
                    text:'标记为熟知词',
                    handler:()=>{
                        this.markAsMaster();
                    }
                },
                {
                    text:'取消',
                    role:'cancel'
                }
            ]
        });
        actionSheet.present();
    }

    ionViewWillLeave():void{
        console.log('will leave this page');
    }

}
