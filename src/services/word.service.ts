import { Injectable } from '@angular/core';
import {RepoBrief, RepoDetail} from "../classes/repo";
import {Http} from "@angular/http";
import 'rxjs/add/operator/toPromise'
import {WordEntry, WordRecord} from "../classes/word";
import { Storage } from '@ionic/storage';


@Injectable()
export class WordService {
    wordRecords={};

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

    generateWait(wordRecord:WordRecord):void{
        wordRecord.wait=Math.pow(2,wordRecord.proficiency);
    }

    // impulseData:any=null;
    wordsLearning:any[]=null;
    saveWordsLearning():void{
        this.storage.set('wordsLearning',this.wordsLearning);
    }
    freshWordsLearning():void{
        this.storage.get('wordsLearning')
            .then(data=>this.wordsLearning=data);
    }
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
        this.storage.set('wordRecords',this.wordRecords);
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
