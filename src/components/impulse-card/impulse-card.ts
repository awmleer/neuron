import {Component, EventEmitter, Input, Output} from '@angular/core'
import {Sentence, EntryBrief, EntryRecord} from '../../classes/entry'
import {StudyService} from '../../services/study.service'
import {SettingService} from '../../services/setting.service'
import {Platform} from 'ionic-angular'
import {InAppBrowser, InAppBrowserOptions} from '@ionic-native/in-app-browser'
import {Impulsement} from '../../classes/impulse'


@Component({
  selector: 'impulse-card',
  templateUrl: 'impulse-card.html',
})
export class ImpulseCardComponent {
  @Input() impulsement: Impulsement
  @Input() type: 'learn' | 'review'
  @Input() cardExpanding: boolean
  @Output() wantExpanding = new EventEmitter()
  showChinese: boolean

  get entry():EntryBrief{
    return this.impulsement.record.entry
  }

  get record():EntryRecord{
    return this.impulsement.record
  }

  get starredSentenceIds():number[]{
    return this.impulsement.record.starredSentenceIds
  }

  get word():string{
    return this.impulsement.record.entry.word
  }

  constructor(
    public studySvc: StudyService,
    public settingService: SettingService,
    public platform: Platform,
    private inAppBrowser: InAppBrowser,
  ) {}

  ngOnInit() {
    if (!this.impulsement) return
    this.showChinese = (this.type == 'learn' && this.impulsement.mark === null) ? true : this.settingService.settings.showChineseWhenReviewing
    // this.studySvc.getEntry(this.impulsement.word)
    //   .then(entry => {
    //     this.entry = entry
    //   })
    //saveWordsImpulsing every time we get a new currentWord
    this.studySvc.saveWordsImpulsing(this.type)
  }

  sentenceStarred(sentence: Sentence): boolean {
    if (this.starredSentenceIds) {
      return this.starredSentenceIds.indexOf(sentence.id) > -1
    } else {
      return false
    }
  }


  expand() {
    this.wantExpanding.emit()
    // this.cardExpanding=true
    if (this.settingService.settings.autoRead) {
      this.playSound()
    }
  }

  playSound(): void {
    (<HTMLAudioElement>document.getElementById('sound-' + this.word)).play()
  }


  async toggleSentenceStar(sentence: Sentence) {
    if(this.sentenceStarred(sentence)){
      this.impulsement.record.starredSentenceIds = await this.studySvc.unstarSentence(sentence)
    }else{
      this.impulsement.record.starredSentenceIds = await this.studySvc.starSentence(sentence)
    }
  }

  async toggleTag(tag: string) {
    this.impulsement.record.tags = await this.studySvc.toggleTag(this.impulsement.record, tag)
  }

  doShowChinese(): void {
    this.showChinese = true
  }


  openDictionary(dictName: string): void {
    let href: string
    switch (dictName) {
      case 'youdao':
        href = `https://m.youdao.com/dict?le=eng&q=${this.word}`
        break
      case 'bing':
        href = `http://cn.bing.com/dict/search?q=${this.word}`
        break
      case 'ciba':
        href = `http://m.iciba.com/${this.word}`
        break
      default:
        return
    }
    let options: InAppBrowserOptions = {
      location: 'no',
    }
    this.inAppBrowser.create(href, '_blank', options)
  }

}
