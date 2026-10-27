import type { AppSettings, AppState, BookEntry, HomeMode } from './types'

const STORAGE_KEY = 'book-log:v1'

const defaultSettings: AppSettings = {
  homeMode: 'calendar',
}

function parseHomeMode(value: unknown): HomeMode {
  if (value === 'quote' || value === 'stats' || value === 'calendar') return value
  return 'calendar'
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { entries: [], settings: { ...defaultSettings } }
    const parsed = JSON.parse(raw) as Partial<AppState>
    return {
      entries: Array.isArray(parsed.entries) ? parsed.entries : [],
      settings: {
        homeMode: parseHomeMode(parsed.settings?.homeMode),
      },
    }
  } catch {
    return { entries: [], settings: { ...defaultSettings } }
  }
}

export function saveState(state: AppState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function createId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export function todayISO() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function entriesOnDate(entries: BookEntry[], date: string) {
  return entries
    .filter((e) => e.date === date)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function datesWithEntries(entries: BookEntry[]) {
  return new Set(entries.map((e) => e.date))
}

export function favoritePassages(entries: BookEntry[]) {
  return entries
    .filter((e): e is Extract<BookEntry, { kind: 'passage' }> => e.kind === 'passage')
    .filter((e) => e.favorite || e.quote.trim().length > 0)
    .sort((a, b) => {
      if (a.favorite !== b.favorite) return a.favorite ? -1 : 1
      return b.createdAt.localeCompare(a.createdAt)
    })
}

export type ReadingStats = {
  thisMonth: number
  thisYear: number
  monthlyAvg: number | null
  yearlyAvg: number | null
  total: number
}

function monthIndex(year: number, month: number) {
  return year * 12 + month
}

export function readingStats(entries: BookEntry[], now = new Date()): ReadingStats {
  const finished = entries.filter((e) => e.kind === 'finished')
  const thisYear = now.getFullYear()
  const thisMonth = now.getMonth()

  let monthCount = 0
  let yearCount = 0
  let earliest: number | null = null
  const years = new Set<number>()

  for (const entry of finished) {
    const [y, m] = entry.date.split('-').map(Number)
    const idx = monthIndex(y, m - 1)
    years.add(y)
    if (earliest === null || idx < earliest) earliest = idx
    if (y === thisYear) yearCount += 1
    if (y === thisYear && m - 1 === thisMonth) monthCount += 1
  }

  const total = finished.length
  const currentIdx = monthIndex(thisYear, thisMonth)
  const monthsSpan =
    earliest === null ? 0 : Math.max(1, currentIdx - earliest + 1)
  const yearsSpan = years.size

  return {
    thisMonth: monthCount,
    thisYear: yearCount,
    monthlyAvg: total === 0 ? null : Math.round((total / monthsSpan) * 10) / 10,
    yearlyAvg:
      total === 0 || yearsSpan === 0
        ? null
        : Math.round((total / yearsSpan) * 10) / 10,
    total,
  }
}
