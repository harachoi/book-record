import { datesWithEntries } from '../storage'
import type { BookEntry } from '../types'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

type Props = {
  year: number
  month: number // 0-indexed
  selectedDate: string
  entries: BookEntry[]
  onSelectDate: (date: string) => void
  onChangeMonth: (year: number, month: number) => void
}

function toISO(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

export default function Calendar({
  year,
  month,
  selectedDate,
  entries,
  onSelectDate,
  onChangeMonth,
}: Props) {
  const marked = datesWithEntries(entries)
  const firstDow = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date()
  const todayISO = toISO(today.getFullYear(), today.getMonth(), today.getDate())

  const cells: Array<number | null> = [
    ...Array.from({ length: firstDow }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  function prev() {
    if (month === 0) onChangeMonth(year - 1, 11)
    else onChangeMonth(year, month - 1)
  }

  function next() {
    if (month === 11) onChangeMonth(year + 1, 0)
    else onChangeMonth(year, month + 1)
  }

  return (
    <div className="panel">
      <div className="calendar-header">
        <h2 className="calendar-title">
          {year}년 {month + 1}월
        </h2>
        <div className="calendar-nav">
          <button type="button" className="icon-btn" onClick={prev} aria-label="이전 달">
            ‹
          </button>
          <button type="button" className="icon-btn" onClick={next} aria-label="다음 달">
            ›
          </button>
        </div>
      </div>

      <div className="weekday-row">
        {WEEKDAYS.map((d) => (
          <div key={d} className="weekday">
            {d}
          </div>
        ))}
      </div>

      <div className="day-grid">
        {cells.map((day, i) => {
          if (day === null) {
            return <div key={`e-${i}`} className="day-cell empty" />
          }
          const iso = toISO(year, month, day)
          const classes = [
            'day-cell',
            iso === todayISO ? 'today' : '',
            iso === selectedDate ? 'selected' : '',
          ]
            .filter(Boolean)
            .join(' ')

          return (
            <button
              key={iso}
              type="button"
              className={classes}
              onClick={() => onSelectDate(iso)}
              aria-label={`${month + 1}월 ${day}일`}
            >
              <span className="day-num">{day}</span>
              {marked.has(iso) ? <span className="day-dot" /> : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}
