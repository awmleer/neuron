import {Component} from '@angular/core'
import {NavParams, ActionSheetController} from 'ionic-angular'
import {NavController} from 'ionic-angular'
import {WordService} from '../../services/word.service'
import {EntryRecord} from '../../classes/entry'
import {SettingService} from '../../services/setting.service'
import * as _ from 'lodash'
import {ImpulseRecord} from '../../classes/impulse'


@Component({
  selector: 'page-impulse',
  templateUrl: 'impulse.html',
})
export class ImpulsePage {
  amount: number
  impulseRecords: ImpulseRecord[]
  impulseRecordsRendering: ImpulseRecord[] = [null, null]
  cardExpandingFlags: boolean[] = [false, false]
  lastImpulseRecord: ImpulseRecord
  lastWordRecord: EntryRecord
  shouldAnimate: boolean = false
  transiting: boolean = false


  constructor(
    public nav: NavController,
    private navParams: NavParams,
    public wordService: WordService,
    public settingService: SettingService,
    public actionSheetCtrl: ActionSheetController,
  ) {}

  get type():'learn'|'review'{
    return this.navParams.get('type')
  }

  ngOnInit(): void {
    //TODO impulseRecords的初始化应该是通过API或者上级页面传入
    if (this.type == 'learn') {
      this.impulseRecords = this.wordService.wordsLearning
    } else if (this.type == 'review') {
      this.impulseRecords = this.wordService.wordsReviewing
    }
    this.amount = this.impulseRecords.length
    this.impulseRecordsRendering[1] = this.nextWord()
    this.shouldAnimate = true
  }


  nextWord(): ImpulseRecord {
    let allDone = true
    for (let i = 0; i < this.impulseRecords.length; i++) {
      if (this.impulseRecords[i].wait == 0) {
        // this.impulseRecordsRendering[1]=this.impulseRecords[i]
        // this.initWord()
        return this.impulseRecords[i]
      } else {
        if (this.impulseRecords[i].wait != -1) allDone = false
      }
    }
    if (allDone) {
      console.log('all words are done')
      this.finish()
      return null
    }
    //if all wordImpulsing.wait > 0
    for (let i = 0; i < this.impulseRecords.length; i++) {
      if (this.impulseRecords[i].wait > 0) {
        this.impulseRecords[i].wait--
      }
    }
    return this.nextWord()
  }


  transitNext(word: ImpulseRecord) {
    this.transiting = true
    this.impulseRecordsRendering[2] = word
    this.cardExpandingFlags.push(false)
    setTimeout(() => {
      this.impulseRecordsRendering.shift()
      this.cardExpandingFlags.shift()
      setTimeout(() => {
        this.transiting = false
      }, 320)
    }, 10)
  }

  transitPrevious() {
    this.transiting = true
    this.impulseRecordsRendering.unshift(null)
    this.cardExpandingFlags.unshift(false)
    setTimeout(() => {//after the transition animation ends
      this.impulseRecordsRendering.pop()
      this.cardExpandingFlags.pop()
      this.transiting = false
    }, 320)
  }


  cacheLastWord(): void {
    this.lastImpulseRecord = _.cloneDeep(this.impulseRecordsRendering[1])
    // this.lastWordRecord = _.cloneDeep(this.wordService.wordRecords[this.impulseRecordsRendering[1].word])
  }


  rewind(): void {
    if (this.transiting) return
    for (let i in this.impulseRecords) {
      if (this.impulseRecords[i].record.id == this.lastImpulseRecord.record.id) {
        this.impulseRecords[i] = _.cloneDeep(this.lastImpulseRecord)
        this.impulseRecordsRendering[0] = this.impulseRecords[i]
        setTimeout(() => {
          this.transitPrevious()
        }, 10)
      }
    }
    //TODO this.wordSvc.overwriteRecord()
    // if (this.lastWordRecord) {
    //   this.wordService.wordRecords[this.lastImpulseRecord.word] = _.cloneDeep(this.lastWordRecord)
    // } else {
    //   delete this.wordService.wordRecords[this.lastImpulseRecord.word]
    // }
    this.lastImpulseRecord = null
    this.lastWordRecord = null
    // this.nextWord()
  }


  finish(): void {
    if (this.type == 'learn') {
      this.wordService.removeWordsLearning()
    } else if (this.type == 'review') {
      this.wordService.saveWordsImpulsing(this.type)
    }
    this.nav.pop()
  }

  clickKnow(): void {
    if (this.transiting) return
    this.cacheLastWord()
    if (this.impulseRecordsRendering[1].dirty == 0) {//First time today
      this.impulseRecordsRendering[1].dirty = 1
      this.impulseRecordsRendering[1].wait = -1;//never show this word today
      if (this.type == 'learn') this.wordService.addRecord(this.impulseRecordsRendering[1].entry, 'know')
      if (this.type == 'review') this.wordService.moltRecord(this.impulseRecordsRendering[1].entry, 'know')
    } else {
      this.impulseRecordsRendering[1].count += 1
      if (this.impulseRecordsRendering[1].count == this.settingService.settings.impulseIntensity) {//if count reaches max
        this.impulseRecordsRendering[1].wait = -1;//this word is done for today
        if (this.impulseRecordsRendering[1].dirty == 2) {
          if (this.type == 'learn') this.wordService.addRecord(this.impulseRecordsRendering[1].entry, 'vague')
          if (this.type == 'review') this.wordService.moltRecord(this.impulseRecordsRendering[1].entry, 'vague')
        } else if (this.impulseRecordsRendering[1].dirty == 3) {
          if (this.type == 'learn') this.wordService.addRecord(this.impulseRecordsRendering[1].entry, 'forget')
          if (this.type == 'review') this.wordService.moltRecord(this.impulseRecordsRendering[1].entry, 'forget')
        }
      } else {
        this.impulseRecordsRendering[1].wait = this.impulseRecordsRendering[1].count * 2 + 1
      }
    }
    this.transitNext(this.nextWord())
  }

  clickVague(): void {
    if (this.transiting) return
    this.cacheLastWord()
    if (this.impulseRecordsRendering[1].dirty == 0) {//First time today
      this.impulseRecordsRendering[1].count = Math.floor(this.settingService.settings.impulseIntensity / 2)
      this.impulseRecordsRendering[1].wait = 2
      this.impulseRecordsRendering[1].dirty = 2
    } else {
      //currentWord.count do not change
      this.impulseRecordsRendering[1].wait = this.impulseRecordsRendering[1].count * 2 + 1
    }
    this.transitNext(this.nextWord())
  }

  clickForget(): void {
    if (this.transiting) return
    this.cacheLastWord()
    if (this.impulseRecordsRendering[1].dirty == 0) {//First time today
      this.impulseRecordsRendering[1].count = 1
      this.impulseRecordsRendering[1].wait = 2
      this.impulseRecordsRendering[1].dirty = 3
    } else {
      if (this.impulseRecordsRendering[1].count > 0) this.impulseRecordsRendering[1].count--
      this.impulseRecordsRendering[1].wait = this.impulseRecordsRendering[1].count * 2 + 1
    }
    this.transitNext(this.nextWord())
  }

  markAsMaster(): void {
    if (this.transiting) return
    if (this.type == 'learn') this.wordService.addRecord(this.impulseRecordsRendering[1].word, 'master')
    if (this.type == 'review') this.wordService.moltRecord(this.impulseRecordsRendering[1].word, 'master')
    this.impulseRecordsRendering[1].wait = -1;//never show it today
    this.impulseRecordsRendering[1].dirty = 4
    this.transitNext(this.nextWord())
  }


  showActionSheet(): void {
    let actionSheet = this.actionSheetCtrl.create({
      title: '更多操作',
      buttons: [
        {
          text: `当前队列：共${this.amount}个单词`,
        },
        {
          text: '标记为熟知词',
          handler: () => {
            this.markAsMaster()
          },
        },
        {
          text: '取消',
          role: 'cancel',
        },
      ],
    })
    actionSheet.present()
  }


  expandCard(i) {
    if (this.transiting) return
    this.cardExpandingFlags[i] = true
  }


  get impulsePercent() {
    let total = this.impulseRecords.length * 6
    let finished = 0
    for (let word in this.impulseRecords) {
      if (this.impulseRecords[word].wait == -1) {
        finished += 6
      } else {
        finished += this.impulseRecords[word].count
      }
    }
    return (Math.round(finished / total * 100) + '%')
  }

}
