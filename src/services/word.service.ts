import { Injectable } from '@angular/core';
import {RepoBrief, RepoDetail} from "../classes/repo";
import {Http} from "@angular/http";
import * as _ from "lodash";
import 'rxjs/add/operator/toPromise'

@Injectable()
export class WordService {
    constructor(private http:Http){

    }
    studiedWords:any[];
    isStudied(word:string):Boolean{
        return !(typeof _.find(this.studiedWords,{'word':word})==='undefined');
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
