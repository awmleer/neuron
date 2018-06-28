export interface Paginated<T> {
  hasNext: boolean
  items: T[]
}
