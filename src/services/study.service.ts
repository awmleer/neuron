import {Injectable} from '@angular/core'
import {RepoBrief, RepoDetail} from '../classes/repo'
import 'rxjs/add/operator/toPromise'
import {EntryBrief, EntryRecord, Sentence} from '../classes/entry'
import {Storage} from '@ionic/storage'
import * as moment from 'moment'
import * as _ from 'lodash'
import {CONST} from '../app/const'
import {ApiService} from './api.service'
import {Impulsement} from '../classes/impulse'


@Injectable()
export class StudyService {
  impulsementsLearning: Impulsement[] = null
  impulsementsReviewing: Impulsement[]

  constructor(
    private apiSvc: ApiService,
    private storage: Storage,
  ) {}


  async initialize() {
    let reviewingStored = await this.storage.get('impulsementsReviewing')
    await this.getLearnList()

    //TODO get review list
  }

  saveWaitsFreshTime(): void {
    this.storage.set('wordWaitsFreshTime', moment().valueOf())
  }

  todayLearnedCount():Promise<number>{
    return this.apiSvc.get('/study/learn/today-count/')
  }

  todayReviewedCount():Promise<number>{
    return this.apiSvc.get('/study/review/today-count/')
  }

  async getLearnList():Promise<void>{
    let records:EntryRecord[] = await this.apiSvc.get('/study/learn/list/')
    this.updateImpulsementsLearning(records)
  }

  async getReviewList():Promise<void>{
    let records:EntryRecord[] = await this.apiSvc.get('/study/learn/list/')
    this.impulsementsReviewing = this.mergeImpulsements(records, await this.storage.get('impulsementsLearning'))
  }

  async generateLearnList(repo:RepoBrief, amount:number):Promise<Impulsement[]>{
    const records:EntryRecord[] = await this.apiSvc.get('/study/learn/list/generate/', {
      'repoId': repo.id,
      'amount': amount
    })
    await this.updateImpulsementsLearning(records)
    return this.impulsementsLearning
  }

  private mergeImpulsements(records:EntryRecord[], stored:Impulsement[]):Impulsement[]{
    let res:Impulsement[] = []
    let count = 0
    for(let record of records){
      count++
      let impulsement = null
      for(let i of stored){
        if(i.record.id === record.id){
          i.record.entry = record.entry
          impulsement = i
        }
      }
      if(impulsement===null){
        impulsement = new Impulsement(record)
        impulsement.wait = count
      }
      res.push(impulsement)
    }
    return res
  }

  private async updateImpulsementsLearning(records:EntryRecord[]){
    if (this.impulsementsLearning === null) {
      this.impulsementsLearning = []
    }
    this.impulsementsLearning = this.mergeImpulsements(records, await this.storage.get('impulsementsLearning'))
  }

  async updateRecords(impulsements:Impulsement[]):Promise<void>{
    let data = []
    for(let impulsement of impulsements){
      if(impulsement.wait === -1){
        data.push({
          'id': impulsement.record.id,
          'mark': impulsement.mark
        })
      }
    }
    if(data.length>0){
      await this.apiSvc.post(`/study/update-records/`, data)
    }
  }

  // generateWordsReviewing(): void {
  //   this.impulsementsReviewing = []
  //   let i = 0
  //   for (let word in this.wordRecords) {
  //     let record = this.wordRecords[word]
  //     if (record.wait == 0) {
  //       let count
  //       switch (record.proficiency) {
  //         case 0:
  //           count = 1
  //           break
  //         case 1:
  //           count = 1
  //           break
  //         case 2:
  //           count = 2
  //           break
  //         case 3:
  //           count = 2
  //           break
  //         case 4:
  //           count = 2
  //           break
  //         case 5:
  //           count = 3
  //           break
  //         case 6:
  //           count = 3
  //           break
  //         case 7:
  //           count = 3
  //           break
  //         case 8:
  //           count = 3
  //           break
  //         default:
  //           count = 0
  //       }
  //       this.impulsementsReviewing.push({
  //         word: word,
  //         count: count,
  //         wait: i,
  //         mark: 0,
  //       })
  //       i++
  //     }
  //   }
  //   this.saveWordsImpulsing('review');//this will override yesterday's record, if yesterday the user didn't finish reviewing
  // }


  saveWordsImpulsing(type: 'learn'|'review'): void {
    if (type == 'learn') {
      this.storage.set('impulsementsLearning', this.impulsementsLearning)
    } else if (type == 'review') {
      this.storage.set('impulsementsReviewing', this.impulsementsReviewing)
    }
  }

  //we only need to remove impulsementsLearning cause user may generate more than one learning list but only one reviewing list in one day
  async removeWordsLearning() {
    this.impulsementsLearning = null
    await this.storage.remove('impulsementsLearning')
  }


  // getEntry(word: string): Promise<EntryBrief> {
  //   return this.apiSvc.get(`/entry/${word}/`)
  // }

  starSentence(sentence:Sentence):Promise<number[]>{
    return this.apiSvc.get(`/study/sentence/${sentence.id}/star/`)
  }

  unstarSentence(sentence:Sentence):Promise<number[]>{
    return this.apiSvc.get(`/study/sentence/${sentence.id}/unstar/`)
  }

  toggleTag(record:EntryRecord, tag:string):Promise<string[]>{
    return this.apiSvc.get(`/study/record/${record.id}/toggle-tag/${tag}/`)
  }

}
