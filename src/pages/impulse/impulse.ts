import {Component} from '@angular/core';
import { NavParams } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import {RepoDetail} from "../../classes/repo";
import {WordService} from "../../services/word.service";
import {WordEntry} from "../../classes/word";


@Component({
    selector: 'page-impulse',
    templateUrl: 'impulse.html'
})
export class ImpulsePage {
    amount:number;
    queue:any[]=[];
    repo:RepoDetail;
    unstudied:any[]=[];
    entry:WordEntry;
    constructor(
        public navCtrl: NavController,
        private navParams: NavParams,
        private wordService:WordService
    ) {}
    ngOnInit(): void {
        this.amount=this.navParams.get('amount');
        this.wordService.getRepo(this.navParams.get('repo').id)
            .then(repo=>{
                this.repo=repo;
                for (let i = 0; i < repo.words.length; i++) {
                    if (this.wordService.isStudied(repo.words[i])==false) {
                        this.unstudied.push(repo.words[i]);
                    }
                }
                this.queue[0]={
                    word:this.unstudied.shift(),
                    count:0
                };
                this.wordService.getEntry(this.queue[0].word)
                    .then(entry=>{
                        this.entry=entry;
                    })
            });

        // console.log(_);
    }

}
