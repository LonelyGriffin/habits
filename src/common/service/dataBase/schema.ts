import {DBSchema} from 'idb'

export interface DataBaseSchema extends DBSchema {
  diary_notion: {
    key: string
    indexes: {by_date: string}
    value: {
      id: string
      date: string
      text: string
    }
  }
}
