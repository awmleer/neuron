import {Component} from '@angular/core'

import {NavController, AlertController} from 'ionic-angular'
import {StudyService} from '../../services/study.service'
import {EntryRecord} from '../../classes/entry'
import {Paginated} from '../../classes/paginated'

@Component({
  selector: 'page-warehouse',
  templateUrl: 'warehouse.html',
})
export class WarehousePage {
  records:EntryRecord[] = []
  pageNumber:number = 1
  next:boolean = null

  constructor(
    public navCtrl: NavController,
    private studySvc: StudyService,
    private alertCtrl: AlertController,
  ) {}

  ionViewDidEnter(): void {
    // for (let word in this.studySvc.wordRecords) {
    //   let record = this.studySvc.wordRecords[word]
    //   record.word = word
    //   this.records.push(record)
    // }
    this.fetchPage()
  }

  async fetchPage(){
    let page = await this.studySvc.recordList(this.pageNumber)
    this.next = page.next
    this.records.push.apply(this.records, page.items)
    this.pageNumber++
  }

  deleteRecord(record:EntryRecord): void {
    let alert = this.alertCtrl.create({
      title: '提醒',
      subTitle: '确定要把这个单词从已学单词中删除吗？',
      buttons: [
        {
          text: '取消',
        },
        {
          text: '确定',
          handler: data => {
            //TODO
            // this.studySvc.deleteRecord(word)
          },
        },
      ],
    })
    alert.present()
  }


}
