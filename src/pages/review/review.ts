import {Component, ViewChild, ElementRef} from '@angular/core'
import {ModalController, NavController} from 'ionic-angular'
import {ImpulsePage} from '../impulse/impulse'
import {StudyService} from '../../services/study.service'

import Chart from 'chart.js'
import * as moment from 'moment'
import {WarehousePage} from '../warehouse/warehouse'
import {StatisticPage} from '../statistic/statistic'

@Component({
  selector: 'page-review',
  templateUrl: 'review.html',
})
export class ReviewPage {

  todayReviewedCount:number = null

  constructor(
    public nav: NavController,
    private modalCtrl: ModalController,
    private studySvc: StudyService,
  ) {}

  startReview(): void {
    let modal = this.modalCtrl.create(ImpulsePage, {
      type: 'review',
    })
    modal.present()
    modal.onWillDismiss(() => {
      this.ionViewWillEnter()
    })
  }

  goWarehouse(): void {
    this.nav.push(WarehousePage)
  }

  goStatistic(): void {
    this.nav.push(StatisticPage)
  }

  ionViewWillEnter() {
    this.studySvc.getReviewList()
    this.studySvc.todayReviewedCount().then((count) => {
      this.todayReviewedCount = count
    })
  }

}
