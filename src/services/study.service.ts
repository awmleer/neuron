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
import {Paginated} from '../classes/paginated'


@Injectable()
export class StudyService {
  impulsementsLearning: Impulsement[] = null
  impulsementsReviewing: Impulsement[]

  constructor(
    private apiSvc: ApiService,
    private storage: Storage,
  ) {}


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
    let records:EntryRecord[] = await this.apiSvc.get('/study/review/list/')
    this.impulsementsReviewing = this.mergeImpulsements(records, await this.storage.get('impulsementsReviewing'), (record:EntryRecord, index:number) => {
      let count
      switch (record.proficiency) {
        case 0:
          count = 1
          break
        case 1:
          count = 1
          break
        case 2:
          count = 2
          break
        case 3:
          count = 2
          break
        case 4:
          count = 2
          break
        case 5:
          count = 3
          break
        case 6:
          count = 3
          break
        case 7:
          count = 3
          break
        case 8:
          count = 3
          break
        default:
          count = 0
      }
      let impulsement = new Impulsement(record)
      impulsement.count = count
      impulsement.wait = index
      return impulsement
    })
    console.log(this.impulsementsReviewing)
  }

  async generateLearnList(repo:RepoBrief, amount:number):Promise<Impulsement[]>{
    const records:EntryRecord[] = await this.apiSvc.get('/study/learn/list/generate/', {
      'repoId': repo.id,
      'amount': amount
    })
    await this.updateImpulsementsLearning(records)
    return this.impulsementsLearning
  }

  private mergeImpulsements(records:EntryRecord[], stored:Impulsement[], generate:(record:EntryRecord,index:number)=>Impulsement):Impulsement[]{
    let res:Impulsement[] = []
    if(!stored) stored=[]
    let index = 0
    for(let record of records){
      let impulsement = null
      for(let i of stored){
        if(i.record.id === record.id){
          i.record.entry = record.entry
          impulsement = i
        }
      }
      if(impulsement===null){
        impulsement = generate(record, index)
      }
      res.push(impulsement)
      index++
    }
    return res
  }

  private async updateImpulsementsLearning(records:EntryRecord[]){
    if (this.impulsementsLearning === null) {
      this.impulsementsLearning = []
    }
    this.impulsementsLearning = this.mergeImpulsements(records, await this.storage.get('impulsementsLearning'), (record:EntryRecord, index:number) => {
      let impulsement = new Impulsement(record)
      impulsement.wait = index
      return impulsement
    })
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

  recordList(pageNumber:number=1):Promise<Paginated<EntryRecord>>{
    return this.apiSvc.get(`/study/record/list/${pageNumber}/`)
  }

}
