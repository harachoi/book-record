export type EntryKind = 'finished' | 'passage'

export type FinishedEntry = {
  id: string
  kind: 'finished'
  date: string // YYYY-MM-DD
  title: string
  pages?: number
  publisher?: string
  review: string
  createdAt: string
}

export type PassageEntry = {
  id: string
  kind: 'passage'
  date: string
  title: string
  page?: number
  quote: string
  favorite: boolean
  createdAt: string
}

export type BookEntry = FinishedEntry | PassageEntry

export type HomeMode = 'calendar' | 'quote' | 'stats'

export type AppSettings = {
  homeMode: HomeMode
}

export type AppState = {
  entries: BookEntry[]
  settings: AppSettings
}
