import {Component, Input} from '@angular/core';
import {WordEntry, WordImpulsing} from "../../classes/word";
import {WordService} from "../../services/word.service";
import {SettingService} from "../../services/setting.service";
import {InAppBrowser} from 'ionic-native';


@Component({
    selector: 'impulse-card',
    templateUrl: 'impulse-card.html'
})
export class ImpulseCardComponent {
    @Input()
    wordImpulsing:WordImpulsing;
    @Input()
    type:'learn'|'review';
    entry: WordEntry;
    cardExpanding:boolean=false;
    showChinese:boolean;
    sentences:any[]=[];


    constructor(
        public wordService:WordService,
        public settingService: SettingService,
    ) {}

    ngOnInit(){
        this.showChinese=(this.type=='learn'&&this.wordImpulsing.dirty==0)?true:this.settingService.settings.showChineseWhenReviewing;
        this.entry=null;
        this.wordService.getEntry(this.wordImpulsing.word)
            .then(entry=>{
                this.entry=entry;
                this.updateSentences();
            });
        //saveWordsImpulsing every time we get a new currentWord
        this.wordService.saveWordsImpulsing(this.type);
    }


    updateSentences(){
        if (this.entry==null) {
            this.sentences=[];
        }
        let starredIds=this.wordService.starredSentences[this.wordImpulsing.word];
        if (!starredIds) starredIds=[];
        let starred=[];
        let notStarred=[];
        for (let i=0;i<this.entry.sentences.length;i++) {
            let sentence={
                id:i,//TODO
                text: this.entry.sentences[i],
                starred: starredIds.indexOf(i)>-1
            };
            if (sentence.starred) {
                starred.push(sentence);
            }else{
                notStarred.push(sentence);
            }
        }
        this.sentences=starred.concat(notStarred);
    }

    expand(){
        this.cardExpanding=true;
        if (this.settingService.settings.autoRead) {
            this.playSound();
        }
    }

    playSound():void{
        (<HTMLAudioElement>document.getElementById("sound-"+this.wordImpulsing.word)).play();
    }


    toggleSentenceStar(sentence):void{
        if (this.wordService.starredSentences[this.wordImpulsing.word] == null) {
            this.wordService.starredSentences[this.wordImpulsing.word]=[];
        }
        let starred=this.wordService.starredSentences[this.wordImpulsing.word];
        let index=starred.indexOf(sentence.id);
        if (index==-1) {
            starred.push(sentence.id);
            sentence.starred=true;
        }else{
            starred.splice(index,1);
            sentence.starred=false;
        }
        this.wordService.saveStarredSentences();
    }

    toggleTag(tag:string):void{
        if (this.wordService.wordTags[this.wordImpulsing.word]==null) {
            this.wordService.wordTags[this.wordImpulsing.word]=tag;
        }else{
            if (this.wordService.wordTags[this.wordImpulsing.word].indexOf(tag)==-1) {
                this.wordService.wordTags[this.wordImpulsing.word]+=tag;
            }else{
                this.wordService.wordTags[this.wordImpulsing.word]=this.wordService.wordTags[this.wordImpulsing.word].replace(tag,'');
            }
        }
        this.wordService.saveWordTags();
    }

    doShowChinese():void{
        this.showChinese=true;
    }


    openDictionary(dictName:string):void{
        let href:string;
        switch(dictName){
            case 'youdao':
                href=`https://m.youdao.com/dict?le=eng&q=${this.wordImpulsing.word}`;
                break;
            case 'bing':
                href=`http://cn.bing.com/dict/search?q=${this.wordImpulsing.word}`;
                break;
            case 'ciba':
                href = `http://m.iciba.com/${this.wordImpulsing.word}`
                break;
            default:
                return;
        }
        new InAppBrowser(href,'_blank','location=no');
    }

}
