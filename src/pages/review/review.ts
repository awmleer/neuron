import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import {ImpulsePage} from "../impulse/impulse";
import {WordService} from "../../services/word.service";

@Component({
  selector: 'page-review',
  templateUrl: 'review.html'
})
export class ReviewPage {

  constructor(
      public nav: NavController,
      private wordService:WordService
  ) {}

  startReview():void{
      this.nav.push(ImpulsePage,{
          type:'review'
      })
  }

}
