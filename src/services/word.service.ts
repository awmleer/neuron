import { Injectable } from '@angular/core';
import {RepoBrief} from "../classes/repo";
import {Http} from "@angular/http";

import 'rxjs/add/operator/toPromise'

@Injectable()
export class WordService {
    constructor(private http:Http){}
    getRepos():Promise<RepoBrief[]> {
        return this.http.get('/api/repo/list/')
            .toPromise()
            .then(response=>response.json() as RepoBrief[]);
    }
}
