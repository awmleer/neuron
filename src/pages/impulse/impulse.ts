import {Component} from '@angular/core'
import {NavParams, ActionSheetController} from 'ionic-angular'
import {NavController} from 'ionic-angular'
import {StudyService} from '../../services/study.service'
import {EntryRecord} from '../../classes/entry'
import {SettingService} from '../../services/setting.service'
import * as _ from 'lodash'
import {Impulsement} from '../../classes/impulse'


@Component({
  selector: 'page-impulse',
  templateUrl: 'impulse.html',
})
export class ImpulsePage {
  amount: number
  impulsements: Impulsement[]
  impulsementsRendering: Impulsement[] = [null, null]
  cardExpandingFlags: boolean[] = [false, false]
  lastImpulsement: Impulsement
  shouldAnimate: boolean = false
  transiting: boolean = false


  constructor(
    public nav: NavController,
    private navParams: NavParams,
    public studySvc: StudyService,
    public settingService: SettingService,
    public actionSheetCtrl: ActionSheetController,
  ) {}

  get type():'learn'|'review'{
    return this.navParams.get('type')
  }

  ngOnInit(): void {
    if (this.type == 'learn') {
      this.impulsements = this.studySvc.impulsementsLearning
    } else if (this.type == 'review') {
      this.impulsements = this.studySvc.impulsementsReviewing
    }
    console.log(this.impulsements);
    this.amount = this.impulsements.length
    this.impulsementsRendering[1] = this.nextWord()
    this.shouldAnimate = true
  }


  nextWord(): Impulsement {
    let allDone = true
    for (let i = 0; i < this.impulsements.length; i++) {
      if (this.impulsements[i].wait == 0) {
        // this.impulsementsRendering[1]=this.impulsements[i]
        // this.initWord()
        return this.impulsements[i]
      } else {
        if (this.impulsements[i].wait != -1) allDone = false
      }
    }
    if (allDone) {
      console.log('all words are done')
      this.finish()
      return null
    }
    //if all impulsement.wait > 0
    for (let i = 0; i < this.impulsements.length; i++) {
      if (this.impulsements[i].wait > 0) {
        this.impulsements[i].wait--
      }
    }
    return this.nextWord()
  }


  transitNext(word: Impulsement) {
    this.studySvc.saveWordsImpulsing(this.type)//TODO maybe not suitable here
    this.transiting = true
    this.impulsementsRendering[2] = word
    this.cardExpandingFlags.push(false)
    setTimeout(() => {
      this.impulsementsRendering.shift()
      this.cardExpandingFlags.shift()
      setTimeout(() => {
        this.transiting = false
      }, 320)
    }, 10)
  }

  transitPrevious() {
    this.studySvc.saveWordsImpulsing(this.type)//TODO maybe not suitable here
    this.transiting = true
    this.impulsementsRendering.unshift(null)
    this.cardExpandingFlags.unshift(false)
    setTimeout(() => {//after the transition animation ends
      this.impulsementsRendering.pop()
      this.cardExpandingFlags.pop()
      this.transiting = false
    }, 320)
  }


  cacheLastWord(): void {
    this.lastImpulsement = _.cloneDeep(this.impulsementsRendering[1])
    // this.lastWordRecord = _.cloneDeep(this.studySvc.wordRecords[this.impulsementsRendering[1].word])
  }


  rewind(): void {
    if (this.transiting) return
    for (let i in this.impulsements) {
      if (this.impulsements[i].record.id == this.lastImpulsement.record.id) {
        this.impulsements[i] = _.cloneDeep(this.lastImpulsement)
        this.impulsementsRendering[0] = this.impulsements[i]
        setTimeout(() => {
          this.transitPrevious()
        }, 10)
      }
    }
    //TODO this.wordSvc.overwriteRecord()
    // if (this.lastWordRecord) {
    //   this.studySvc.wordRecords[this.lastImpulsement.word] = _.cloneDeep(this.lastWordRecord)
    // } else {
    //   delete this.studySvc.wordRecords[this.lastImpulsement.word]
    // }
    this.lastImpulsement = null
    // this.lastWordRecord = null
    // this.nextWord()
  }


  async finish() {
    await this.studySvc.saveWordsImpulsing(this.type)
    await this.studySvc.updateRecords(this.impulsements)
    this.nav.pop()
  }

  async clickKnow() {
    if (this.transiting) return
    this.cacheLastWord()
    if (this.impulsementsRendering[1].mark === null) {//First time today
      this.impulsementsRendering[1].mark = 'know'
      this.impulsementsRendering[1].wait = -1;//never show this word today
    } else {
      this.impulsementsRendering[1].count += 1
      if (this.impulsementsRendering[1].count == this.settingService.settings.impulseIntensity) {//if count reaches max
        this.impulsementsRendering[1].wait = -1;//this word is done for today
      } else {
        this.impulsementsRendering[1].wait = this.impulsementsRendering[1].count * 2 + 1
      }
    }
    this.transitNext(this.nextWord())
  }

  clickVague(): void {
    if (this.transiting) return
    this.cacheLastWord()
    if (this.impulsementsRendering[1].mark === null) {//First time today
      this.impulsementsRendering[1].count = Math.floor(this.settingService.settings.impulseIntensity / 2)
      this.impulsementsRendering[1].wait = 4
      this.impulsementsRendering[1].mark = 'vague'
    } else {
      //currentWord.count do not change
      this.impulsementsRendering[1].wait = this.impulsementsRendering[1].count * 2 + 1
    }
    this.transitNext(this.nextWord())
  }

  clickForget(): void {
    if (this.transiting) return
    this.cacheLastWord()
    if (this.impulsementsRendering[1].mark === null) {//First time today
      this.impulsementsRendering[1].count = 1
      this.impulsementsRendering[1].wait = 2
      this.impulsementsRendering[1].mark = 'forget'
    } else {
      if (this.impulsementsRendering[1].count > 0) this.impulsementsRendering[1].count--
      this.impulsementsRendering[1].wait = this.impulsementsRendering[1].count * 2 + 1
    }
    this.transitNext(this.nextWord())
  }

  async markAsMaster() {
    if (this.transiting) return
    this.impulsementsRendering[1].wait = -1;//never show it today
    this.impulsementsRendering[1].mark = 'master'
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
    let total = this.impulsements.length * 6
    let finished = 0
    for (let word in this.impulsements) {
      if (this.impulsements[word].wait == -1) {
        finished += 6
      } else {
        finished += this.impulsements[word].count
      }
    }
    return (Math.round(finished / total * 100) + '%')
  }

}
