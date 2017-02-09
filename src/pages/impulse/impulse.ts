import {Component} from '@angular/core';
import { NavParams } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import {RepoDetail} from "../../classes/repo";
import {WordService} from "../../services/word.service";


@Component({
    selector: 'page-impulse',
    templateUrl: 'impulse.html'
})
export class ImpulsePage {
    amount:number;
    queue:any[]=[];
    repo:RepoDetail;
    unstudied:any[]=[];
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
            });
        // console.log(_);
    }

}
