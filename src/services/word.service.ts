import { Injectable } from '@angular/core';
import {RepoBrief, RepoDetail} from "../classes/repo";
import {Http} from "@angular/http";
import 'rxjs/add/operator/toPromise'
import {WordEntry, WordRecord, WordImpulsing} from "../classes/word";
import { Storage } from '@ionic/storage';
import * as moment from "moment";
import * as _ from "lodash"


@Injectable()
export class WordService {
    wordRecords={};
    wordsLearning:WordImpulsing[]=null;
    wordsReviewing:WordImpulsing[];

    constructor(private http:Http, private storage:Storage){
        this.storage.get('wordRecords').then((wordRecords)=>{
            if (wordRecords) {
                this.wordRecords=wordRecords;
                console.log(this.wordRecords);
            }
        });
    }


    isStudied(word:string):boolean{
        return typeof this.wordRecords[word]!="undefined";
    }


    saveRecordUpdateTime():void{
        this.storage.set('wordRecordUpdateTime',moment().valueOf());
    }
    saveWordRecords():void{
        this.storage.set('wordRecords',this.wordRecords);
    }

    freshWait():void{
        this.storage.get('wordRecordUpdateTime').then(updateTime=>{
            if (updateTime == null) {
                this.saveRecordUpdateTime();
                return;
            }
            let diff=moment().diff(moment(updateTime),'days');
            for (let i = 0; i < diff; i++) {
                for (let word in this.wordRecords) {
                    let record=this.wordRecords[word];
                    if (record.wait > 0) record.wait--;
                }
            }

            if (diff > 0) {//this makes sure these codes will only run one time every day
                this.wordsReviewing=[];
                let i=0;
                for (let word in this.wordRecords) {
                    let record=this.wordRecords[word];
                    if (record.wait == 0) {
                        let count;
                        switch(record.proficiency) {
                            case 0:count=1;break;
                            case 1:count=1;break;
                            case 2: count = 2; break;
                            case 3: count = 2; break;
                            case 4: count = 2; break;
                            case 5: count = 3; break;
                            case 6: count = 3; break;
                            case 7: count = 3; break;
                            case 8: count = 3; break;
                            default: count=0;
                        }
                        this.wordsReviewing.push({
                            word:word,
                            count:count,
                            wait:i,
                            dirty:0
                        });
                        i++;
                    }
                }
                this.saveRecordUpdateTime();
                this.saveWordRecords();
                this.saveWordsImpulsing('review');//this will override yesterday's record, if yesterday the user didn't finish reviewing
            }
        });
    }

    generateWait(wordRecord:WordRecord):void{
        wordRecord.wait=Math.pow(2,wordRecord.proficiency);
    }


    saveWordsImpulsing(type:string):void{
        if (type == 'learn') {
            this.storage.set('wordsLearning',this.wordsLearning);
        }else if (type == 'review') {
            this.storage.set('wordsReviewing',this.wordsReviewing);
        }
    }
    freshWordsImpulsing():void{
        this.storage.get('wordsLearning')
            .then(data=>this.wordsLearning=data);
        this.storage.get('wordsReviewing')
            .then(data=>{
                this.wordsReviewing=data;
                this.freshWait();
            });
    }

    //we only need to remove wordsLearning cause user may generate more than one learning list
    //but on everyday, reviewing list has only one, so we don't need to remove it after finished
    removeWordsLearning():void{
        this.wordsLearning=null;
        this.storage.remove('wordsLearning');
    }
    // freshImpulseData():void{
    //     this.storage.get('impulseData').then(data=>{
    //         this.impulseData=data;
    //         console.log(data);
    //     });
    // }
    // saveImpulseData(impulseData):void{
    //     this.impulseData=impulseData;
    //     this.storage.set('impulseData',impulseData);
    // }
    // removeImpulseData():void{
    //     this.impulseData=null;
    //     this.storage.remove('impulseData');
    // }


    getEntry(word:string):Promise<WordEntry>{
        return this.http.get(`/api/entry/${word}/`)
            .toPromise()
            .then(response=>response.json() as WordEntry);
    }

    addRecord(word:string,mark:string):void{
        let wordRecord;
        if (mark == 'know') {
            wordRecord=new WordRecord(6);
        }else if (mark == 'vague') {
            wordRecord=new WordRecord(3);
        }else if (mark == 'forget') {
            wordRecord=new WordRecord(0);
        }else if (mark == 'master') {
            wordRecord=new WordRecord(8);
        }
        this.generateWait(wordRecord);
        this.wordRecords[word]=wordRecord;
        this.saveWordRecords();
        console.log(this.wordRecords);
    }

    getRepos():Promise<RepoBrief[]> {
        return this.http.get('/api/repo/list/')
            .toPromise()
            .then(response=>response.json() as RepoBrief[]);
    }
    getRepo(id:number):Promise<RepoDetail> {
        return this.http.get(`/api/repo/${id}/`)
            .toPromise()
            .then(response=>new RepoDetail(response.json()) as RepoDetail);
    }
}
