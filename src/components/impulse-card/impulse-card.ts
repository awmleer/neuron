import {Component, EventEmitter, Input, Output} from '@angular/core'
import {Sentence, EntryBrief, StudyRecord} from '../../classes/entry'
import {StudyService} from '../../services/study.service'
import {SettingService} from '../../services/setting.service'
import {Platform} from 'ionic-angular'
import {InAppBrowser, InAppBrowserOptions} from '@ionic-native/in-app-browser'


@Component({
  selector: 'impulse-card',
  templateUrl: 'impulse-card.html',
})
export class ImpulseCardComponent {
  @Input() wordImpulsing: StudyRecord
  @Input() type: 'learn' | 'review'
  @Input() cardExpanding: boolean
  @Output() wantExpanding = new EventEmitter()
  entry: EntryBrief
  showChinese: boolean
  sentences: any[] = []


  constructor(
    public wordService: StudyService,
    public settingService: SettingService,
    public platform: Platform,
    private inAppBrowser: InAppBrowser,
  ) {}

  ngOnInit() {
    if (!this.wordImpulsing) return
    this.showChinese = (this.type == 'learn' && this.wordImpulsing.dirty == 0) ? true : this.settingService.settings.showChineseWhenReviewing
    this.entry = null
    this.wordService.getEntry(this.wordImpulsing.word)
      .then(entry => {
        this.entry = entry
      })
    //saveWordsImpulsing every time we get a new currentWord
    this.wordService.saveWordsImpulsing(this.type)
  }

  starredIdsOfWord(word: string): number[] {
    return this.wordService.starredSentences[this.wordImpulsing.word]
  }

  sentenceStarred(sentenceId: number): boolean {
    let starredIds = this.wordService.starredSentences[this.wordImpulsing.word]
    if (starredIds) {
      return starredIds.indexOf(sentenceId) > -1
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


  toggleSentenceStar(sentence: Sentence): void {
    if (this.wordService.starredSentences[this.wordImpulsing.word] == null) {
      this.wordService.starredSentences[this.wordImpulsing.word] = []
    }
    let starred = this.wordService.starredSentences[this.wordImpulsing.word]
    let index = starred.indexOf(sentence.id)
    if (starred.indexOf(sentence.id) == -1) {
      starred.push(sentence.id)
      // sentence.starred=true
    } else {
      starred.splice(index, 1)
      // sentence.starred=false
    }
    this.wordService.saveStarredSentences()
  }

  toggleTag(tag: string): void {
    if (this.wordService.wordTags[this.wordImpulsing.word] == null) {
      this.wordService.wordTags[this.wordImpulsing.word] = tag
    } else {
      if (this.wordService.wordTags[this.wordImpulsing.word].indexOf(tag) == -1) {
        this.wordService.wordTags[this.wordImpulsing.word] += tag
      } else {
        this.wordService.wordTags[this.wordImpulsing.word] = this.wordService.wordTags[this.wordImpulsing.word].replace(tag, '')
      }
    }
    this.wordService.saveWordTags()
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
