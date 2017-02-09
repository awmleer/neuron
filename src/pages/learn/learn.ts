import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import {WordService} from "../../services/word.service";
import {RepoBrief} from "../../classes/repo";

@Component({
    selector: 'page-learn',
    templateUrl: 'learn.html',
    providers:[WordService]

})
export class LearnPage {
    repos: RepoBrief[];

    constructor(public navCtrl: NavController,private wordService:WordService) {

    }

    getRepos():void{
        this.wordService.getRepos().then(repos=>{
            this.repos=repos
        });
    }

    ngOnInit(): void {
        this.getRepos();
    }

}
