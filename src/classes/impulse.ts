import {EntryRecord} from './entry'

export type mark = 'know'|'vague'|'forget'|'master'

export class Impulsement {
  record: EntryRecord
  count: number = 0//ranges from 0 to 5(6), when reaches 6, it will be removed from the impulse list
  wait: number = 0 //-1 means this word is finished
  mark: mark = null
  constructor(record:EntryRecord){
    this.record = record
  }
}
