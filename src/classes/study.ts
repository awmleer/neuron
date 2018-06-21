import {EntryRecord} from './entry'

export class StudyRecord {
  record: EntryRecord
  count: number = 0//ranges from 0 to 5(6), when reaches 6, it will be removed from the impulse list
  wait: number = 0
  dirty: number = 0
  constructor(record:EntryRecord){
    this.record = record
  }
}
