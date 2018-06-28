import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core'
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
  @ViewChild('audioUK') audioUKElement:ElementRef;
  @ViewChild('audioUS') audioUSElement:ElementRef;
  showChinese: boolean
  sortedSentences: Sentence[]
  accents = ['UK','US']

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
    public settingSvc: SettingService,
    public platform: Platform,
    private inAppBrowser: InAppBrowser,
  ) {
    let accent = this.settingSvc.settings.sound.accent
    this.accents.splice(this.accents.indexOf(accent), 1)
    this.accents.unshift(accent)
  }

  ngOnInit() {
    if (!this.impulsement) return
    this.showChinese = (this.type == 'learn' && this.impulsement.mark === null) ? true : this.settingSvc.settings.showChineseWhenReviewing
    // this.studySvc.getEntry(this.impulsement.word)
    //   .then(entry => {
    //     this.entry = entry
    //   })
    this.sortSentences()
    //saveWordsImpulsing every time we get a new currentWord
    // this.studySvc.saveWordsImpulsing(this.type)
  }

  private sortSentences(){
    let starred = []
    let unstarred = []
    for(let s of this.entry.sentences){
      if (this.sentenceStarred(s)){
        starred.push(s)
      }else{
        unstarred.push(s)
      }
    }
    this.sortedSentences = starred.concat(unstarred)
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
    if(this.cardExpanding || this.settingSvc.settings.autoRead){
      this.playSound()
    }
  }

  playSound(event:Event=null, accent:string=this.settingSvc.settings.sound.accent): void {
    if(event) event.stopPropagation()
    console.log(accent);
    let element:ElementRef
    if(accent=='UK'){
      element = this.audioUKElement
    }else{
      element = this.audioUSElement
    }
    (<HTMLAudioElement>element.nativeElement).play()
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
