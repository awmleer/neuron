import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import {WordService} from "../../services/word.service";
import {RepoBrief} from "../../classes/repo";
import {ImpulsePage} from "../impulse/impulse";

@Component({
    selector: 'page-learn',
    templateUrl: 'learn.html',
    providers:[WordService]

})
export class LearnPage {
    repos: RepoBrief[];

    constructor(public nav: NavController,private wordService:WordService) {

    }

    getRepos():void{
        this.wordService.getRepos().then(repos=>{
            this.repos=repos
        });
    }

    startLearn(repo):void{
        console.log(repo);
        this.nav.push(ImpulsePage);
    }

    ngOnInit(): void {
        this.getRepos();
    }

}
