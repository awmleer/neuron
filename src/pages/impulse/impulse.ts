import {Component} from '@angular/core'
import {NavParams, ActionSheetController} from 'ionic-angular'
import {NavController} from 'ionic-angular'
import {WordService} from '../../services/word.service'
import {EntryRecord} from '../../classes/entry'
import {SettingService} from '../../services/setting.service'
import * as _ from 'lodash'
import {StudyRecord} from '../../classes/study'


@Component({
  selector: 'page-impulse',
  templateUrl: 'impulse.html',
})
export class ImpulsePage {
  amount: number
  studyRecords: StudyRecord[]
  studyRecordsRendering: StudyRecord[] = [null, null]
  cardExpandingFlags: boolean[] = [false, false]
  lastStudyRecord: StudyRecord
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
    //TODO studyRecords的初始化应该是通过API或者上级页面传入
    if (this.type == 'learn') {
      this.studyRecords = this.wordService.wordsLearning
    } else if (this.type == 'review') {
      this.studyRecords = this.wordService.wordsReviewing
    }
    this.amount = this.studyRecords.length
    this.studyRecordsRendering[1] = this.nextWord()
    this.shouldAnimate = true
  }


  nextWord(): StudyRecord {
    let allDone = true
    for (let i = 0; i < this.studyRecords.length; i++) {
      if (this.studyRecords[i].wait == 0) {
        // this.studyRecordsRendering[1]=this.studyRecords[i]
        // this.initWord()
        return this.studyRecords[i]
      } else {
        if (this.studyRecords[i].wait != -1) allDone = false
      }
    }
    if (allDone) {
      console.log('all words are done')
      this.finish()
      return null
    }
    //if all wordImpulsing.wait > 0
    for (let i = 0; i < this.studyRecords.length; i++) {
      if (this.studyRecords[i].wait > 0) {
        this.studyRecords[i].wait--
      }
    }
    return this.nextWord()
  }


  transitNext(word: StudyRecord) {
    this.transiting = true
    this.studyRecordsRendering[2] = word
    this.cardExpandingFlags.push(false)
    setTimeout(() => {
      this.studyRecordsRendering.shift()
      this.cardExpandingFlags.shift()
      setTimeout(() => {
        this.transiting = false
      }, 320)
    }, 10)
  }

  transitPrevious() {
    this.transiting = true
    this.studyRecordsRendering.unshift(null)
    this.cardExpandingFlags.unshift(false)
    setTimeout(() => {//after the transition animation ends
      this.studyRecordsRendering.pop()
      this.cardExpandingFlags.pop()
      this.transiting = false
    }, 320)
  }


  cacheLastWord(): void {
    this.lastStudyRecord = _.cloneDeep(this.studyRecordsRendering[1])
    // this.lastWordRecord = _.cloneDeep(this.wordService.wordRecords[this.studyRecordsRendering[1].word])
  }


  rewind(): void {
    if (this.transiting) return
    for (let i in this.studyRecords) {
      if (this.studyRecords[i].record.id == this.lastStudyRecord.record.id) {
        this.studyRecords[i] = _.cloneDeep(this.lastStudyRecord)
        this.studyRecordsRendering[0] = this.studyRecords[i]
        setTimeout(() => {
          this.transitPrevious()
        }, 10)
      }
    }
    //TODO this.wordSvc.overwriteRecord()
    // if (this.lastWordRecord) {
    //   this.wordService.wordRecords[this.lastStudyRecord.word] = _.cloneDeep(this.lastWordRecord)
    // } else {
    //   delete this.wordService.wordRecords[this.lastStudyRecord.word]
    // }
    this.lastStudyRecord = null
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
    if (this.studyRecordsRendering[1].dirty == 0) {//First time today
      this.studyRecordsRendering[1].dirty = 1
      this.studyRecordsRendering[1].wait = -1;//never show this word today
      if (this.type == 'learn') this.wordService.addRecord(this.studyRecordsRendering[1].entry, 'know')
      if (this.type == 'review') this.wordService.moltRecord(this.studyRecordsRendering[1].entry, 'know')
    } else {
      this.studyRecordsRendering[1].count += 1
      if (this.studyRecordsRendering[1].count == this.settingService.settings.impulseIntensity) {//if count reaches max
        this.studyRecordsRendering[1].wait = -1;//this word is done for today
        if (this.studyRecordsRendering[1].dirty == 2) {
          if (this.type == 'learn') this.wordService.addRecord(this.studyRecordsRendering[1].entry, 'vague')
          if (this.type == 'review') this.wordService.moltRecord(this.studyRecordsRendering[1].entry, 'vague')
        } else if (this.studyRecordsRendering[1].dirty == 3) {
          if (this.type == 'learn') this.wordService.addRecord(this.studyRecordsRendering[1].entry, 'forget')
          if (this.type == 'review') this.wordService.moltRecord(this.studyRecordsRendering[1].entry, 'forget')
        }
      } else {
        this.studyRecordsRendering[1].wait = this.studyRecordsRendering[1].count * 2 + 1
      }
    }
    this.transitNext(this.nextWord())
  }

  clickVague(): void {
    if (this.transiting) return
    this.cacheLastWord()
    if (this.studyRecordsRendering[1].dirty == 0) {//First time today
      this.studyRecordsRendering[1].count = Math.floor(this.settingService.settings.impulseIntensity / 2)
      this.studyRecordsRendering[1].wait = 2
      this.studyRecordsRendering[1].dirty = 2
    } else {
      //currentWord.count do not change
      this.studyRecordsRendering[1].wait = this.studyRecordsRendering[1].count * 2 + 1
    }
    this.transitNext(this.nextWord())
  }

  clickForget(): void {
    if (this.transiting) return
    this.cacheLastWord()
    if (this.studyRecordsRendering[1].dirty == 0) {//First time today
      this.studyRecordsRendering[1].count = 1
      this.studyRecordsRendering[1].wait = 2
      this.studyRecordsRendering[1].dirty = 3
    } else {
      if (this.studyRecordsRendering[1].count > 0) this.studyRecordsRendering[1].count--
      this.studyRecordsRendering[1].wait = this.studyRecordsRendering[1].count * 2 + 1
    }
    this.transitNext(this.nextWord())
  }

  markAsMaster(): void {
    if (this.transiting) return
    if (this.type == 'learn') this.wordService.addRecord(this.studyRecordsRendering[1].word, 'master')
    if (this.type == 'review') this.wordService.moltRecord(this.studyRecordsRendering[1].word, 'master')
    this.studyRecordsRendering[1].wait = -1;//never show it today
    this.studyRecordsRendering[1].dirty = 4
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
    let total = this.studyRecords.length * 6
    let finished = 0
    for (let word in this.studyRecords) {
      if (this.studyRecords[word].wait == -1) {
        finished += 6
      } else {
        finished += this.studyRecords[word].count
      }
    }
    return (Math.round(finished / total * 100) + '%')
  }

}
