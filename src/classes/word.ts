import * as moment from 'moment'

// export class WordRecord {
//     word:string
//     proficiency:number;//range from 0 to 8
//     addTime:number
//     wait:number=0
//     constructor (word:string, proficiency:number){
//         this.word=word
//         this.proficiency=proficiency
//         this.addTime=moment().valueOf()
//     }
// }

export class WordRecord {
  proficiency: number;//range from 0 to 8
  addTime: number
  wait: number = 0

  constructor(proficiency: number) {
    this.proficiency = proficiency
    this.addTime = moment().valueOf()
  }
}

export class WordImpulsing {
  entry: Entry
  count: number = 0//ranges from 0 to 5(6), when reaches 6, it will be removed from the impulse list
  wait: number = 0
  dirty: number = 0
  constructor(entry:Entry){
    this.entry=entry
  }
}


export class Entry {
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
