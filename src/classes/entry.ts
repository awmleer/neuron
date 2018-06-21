import * as moment from 'moment'

// export class EntryRecord {
//     word:string
//     proficiency:number;//range from 0 to 8
//     createdAt:number
//     wait:number=0
//     constructor (word:string, proficiency:number){
//         this.word=word
//         this.proficiency=proficiency
//         this.createdAt=moment().valueOf()
//     }
// }

export class EntryRecord {
  id: number
  proficiency: number//range from 0 to 8
  createdAt: number
  nextReviewDate: number
  entry: EntryBrief
}


export class EntryBrief {
  word: string
  level: number
  definitions: {
    type: string
    text: string
  }[]
  definition_rates: any
  phonetic: {
    UK: {
      sound: {
        female: string
        male: string
      },
      symbol: {
        female: string
        male: string
      }
    },
    US: {
      sound: {
        female: string
        male: string
      },
      symbol: {
        female: string
        male: string
      }
    }
  }
  sentences: Sentence[]
}


export class Sentence {
  id: number
  chinese: string
  english: string
}
