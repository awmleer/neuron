import {Component, EventEmitter, Input, Output} from '@angular/core'
import {Sentence, EntryBrief} from '../../classes/entry'
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
  @Input() wordImpulsing: Impulsement
  @Input() type: 'learn' | 'review'
  @Input() cardExpanding: boolean
  @Output() wantExpanding = new EventEmitter()
  showChinese: boolean
  sentences: any[] = []

  get entry():EntryBrief{
    if(this.wordImpulsing){
      return this.wordImpulsing.record.entry
    }else{
      return null
    }
  }

  get starredSentenceIds():number[]{
    return this.wordImpulsing.record.starredSentenceIds
  }

  constructor(
    public studySvc: StudyService,
    public settingService: SettingService,
    public platform: Platform,
    private inAppBrowser: InAppBrowser,
  ) {}

  ngOnInit() {
    if (!this.wordImpulsing) return
    this.showChinese = (this.type == 'learn' && this.wordImpulsing.mark === null) ? true : this.settingService.settings.showChineseWhenReviewing
    // this.studySvc.getEntry(this.wordImpulsing.word)
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
    (<HTMLAudioElement>document.getElementById('sound-' + this.wordImpulsing.word)).play()
  }


  async toggleSentenceStar(sentence: Sentence) {
    if(this.sentenceStarred(sentence)){
      this.wordImpulsing.record.starredSentenceIds = await this.studySvc.unstarSentence(sentence)
    }else{
      this.wordImpulsing.record.starredSentenceIds = await this.studySvc.starSentence(sentence)
    }
  }

  toggleTag(tag: string): void {
    if (this.studySvc.wordTags[this.wordImpulsing.word] == null) {
      this.studySvc.wordTags[this.wordImpulsing.word] = tag
    } else {
      if (this.studySvc.wordTags[this.wordImpulsing.word].indexOf(tag) == -1) {
        this.studySvc.wordTags[this.wordImpulsing.word] += tag
      } else {
        this.studySvc.wordTags[this.wordImpulsing.word] = this.studySvc.wordTags[this.wordImpulsing.word].replace(tag, '')
      }
    }
    this.studySvc.saveWordTags()
  }

  doShowChinese(): void {
    this.showChinese = true
  }


  openDictionary(dictName: string): void {
    let href: string
    switch (dictName) {
      case 'youdao':
        href = `https://m.youdao.com/dict?le=eng&q=${this.wordImpulsing.word}`
        break
      case 'bing':
        href = `http://cn.bing.com/dict/search?q=${this.wordImpulsing.word}`
        break
      case 'ciba':
        href = `http://m.iciba.com/${this.wordImpulsing.word}`
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
