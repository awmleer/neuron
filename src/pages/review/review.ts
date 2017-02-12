import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import {ImpulsePage} from "../impulse/impulse";

@Component({
  selector: 'page-review',
  templateUrl: 'review.html'
})
export class ReviewPage {

  constructor(
      public nav: NavController
  ) {}

  startReview():void{
      this.nav.push(ImpulsePage,{
          type:'review'
      })
  }

}
