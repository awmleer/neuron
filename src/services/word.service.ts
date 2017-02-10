import { Injectable } from '@angular/core';
import {RepoBrief, RepoDetail} from "../classes/repo";
import {Http} from "@angular/http";
import * as _ from "lodash";
import 'rxjs/add/operator/toPromise'
import {WordEntry, WordRecord} from "../classes/word";
import { Storage } from '@ionic/storage';

@Injectable()
export class WordService {
    constructor(private http:Http, private storage:Storage){
        storage.get('wordRecords').then(wordRecords=>{
            if (wordRecords) {
                this.wordRecords=wordRecords;
                console.log('get success');
                console.log(this.wordRecords);
            }else {
                console.log('get fail');
                console.log(wordRecords);
            }
        });

    }

    wordRecords:WordRecord[]=[];
    isStudied(word:string):boolean{
        for (let i = 0; i < this.wordRecords.length; i++) {
            if (this.wordRecords[i].word == word) {
                return true;
            }
        }
        return false;
    }

    changeWait(wordRecord:WordRecord):void{
        wordRecord.wait=Math.pow(2,wordRecord.proficiency);
    }

    getEntry(word:string):Promise<WordEntry>{
        return this.http.get(`/api/entry/${word}/`)
            .toPromise()
            .then(response=>response.json() as WordEntry);
    }

    addRecord(word:string,mark:string):void{
        let wordRecord;
        if (mark == 'know') {
            wordRecord=new WordRecord(word,6);
        }else if (mark == 'vague') {
            wordRecord=new WordRecord(word,3);
        }else if (mark == 'forget') {
            wordRecord=new WordRecord(word,0);
        }
        this.changeWait(wordRecord);
        this.wordRecords.push(wordRecord);
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
            .then(response=>response.json() as RepoDetail);
    }
}
