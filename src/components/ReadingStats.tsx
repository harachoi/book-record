import { readingStats } from '../storage'
import type { BookEntry } from '../types'

type Props = {
  entries: BookEntry[]
  featured?: boolean
}

function formatAvg(value: number | null) {
  if (value === null) return null
  return Number.isInteger(value) ? `${value}` : value.toFixed(1)
}

function StatValue({ value }: { value: number | string | null }) {
  if (value === null) {
    return <span className="stat-value empty">—</span>
  }
  return (
    <span className="stat-value">
      {value}
      <span className="stat-unit">권</span>
    </span>
  )
}

export default function ReadingStats({ entries, featured = false }: Props) {
  const stats = readingStats(entries)

  return (
    <section
      className={`stats-panel panel${featured ? ' stats-featured' : ''}`}
      aria-label="읽기 통계"
    >
      <div className="stats-head">
        <h2 className="stats-title">읽기 흐름</h2>
        <p className="stats-note">다 읽은 책 기준 · 총 {stats.total}권</p>
      </div>
      <div className="stats-grid">
        <div className="stat">
          <StatValue value={stats.thisMonth} />
          <span className="stat-label">이번 달</span>
        </div>
        <div className="stat">
          <StatValue value={stats.thisYear} />
          <span className="stat-label">올해</span>
        </div>
        <div className="stat">
          <StatValue value={formatAvg(stats.monthlyAvg)} />
          <span className="stat-label">월평균</span>
        </div>
        <div className="stat">
          <StatValue value={formatAvg(stats.yearlyAvg)} />
          <span className="stat-label">연평균</span>
        </div>
      </div>
    </section>
  )
}
