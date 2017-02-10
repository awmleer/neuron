import { Injectable } from '@angular/core';
import {RepoBrief, RepoDetail} from "../classes/repo";
import {Http} from "@angular/http";
import * as _ from "lodash";
import 'rxjs/add/operator/toPromise'
import {WordEntry, WordRecord} from "../classes/word";

@Injectable()
export class WordService {
    constructor(private http:Http){

    }
    studiedWords:string[];
    wordRecords:WordRecord[]=[];
    isStudied(word:string):Boolean{
        return !(typeof _.find(this.studiedWords,{'word':word})==='undefined');
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
