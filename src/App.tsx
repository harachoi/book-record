import { useEffect, useMemo, useState } from 'react'
import ActionFab from './components/ActionFab'
import Calendar from './components/Calendar'
import EntryForm from './components/EntryForm'
import EntryList from './components/EntryList'
import QuoteHome from './components/QuoteHome'
import ReadingStats from './components/ReadingStats'
import Settings from './components/Settings'
import {
  entriesOnDate,
  loadState,
  saveState,
  todayISO,
} from './storage'
import type { BookEntry, EntryKind, HomeMode } from './types'

function parseMonth(iso: string) {
  const [y, m] = iso.split('-').map(Number)
  return { year: y, month: m - 1 }
}

export default function App() {
  const initial = loadState()
  const [entries, setEntries] = useState<BookEntry[]>(initial.entries)
  const initialHome =
    initial.settings.homeMode === 'quote' ? 'quote' : 'calendar'
  const [homeMode, setHomeMode] = useState<HomeMode>(initialHome)
  const [homeBase, setHomeBase] = useState<'calendar' | 'quote'>(initialHome)
  const [selectedDate, setSelectedDate] = useState(todayISO())
  const [{ year, month }, setMonth] = useState(() => parseMonth(todayISO()))
  const [menuOpen, setMenuOpen] = useState(false)
  const [formKind, setFormKind] = useState<EntryKind | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [statsListTab, setStatsListTab] = useState<'finished' | 'passage'>('finished')

  useEffect(() => {
    saveState({ entries, settings: { homeMode: homeBase } })
  }, [entries, homeBase])

  const dayEntries = useMemo(
    () => entriesOnDate(entries, selectedDate),
    [entries, selectedDate],
  )

  const recentEntries = useMemo(
    () =>
      [...entries].sort((a, b) => {
        if (a.date !== b.date) return b.date.localeCompare(a.date)
        return b.createdAt.localeCompare(a.createdAt)
      }),
    [entries],
  )

  const finishedEntries = useMemo(
    () => recentEntries.filter((e) => e.kind === 'finished'),
    [recentEntries],
  )

  const passageEntries = useMemo(
    () => recentEntries.filter((e) => e.kind === 'passage'),
    [recentEntries],
  )

  function handleSave(entry: BookEntry) {
    setEntries((prev) => [entry, ...prev])
    setSelectedDate(entry.date)
    const next = parseMonth(entry.date)
    setMonth(next)
    setFormKind(null)
  }

  function handleDelete(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }

  function handleToggleFavorite(id: string) {
    setEntries((prev) =>
      prev.map((e) =>
        e.id === id && e.kind === 'passage'
          ? { ...e, favorite: !e.favorite }
          : e,
      ),
    )
  }

  function openForm(kind: EntryKind) {
    setMenuOpen(false)
    setFormKind(kind)
  }

  function openStats() {
    setMenuOpen(false)
    setHomeMode('stats')
  }

  function goHome() {
    setHomeMode(homeBase)
  }

  function handleChangeHomeMode(mode: HomeMode) {
    if (mode === 'quote' || mode === 'calendar') {
      setHomeBase(mode)
      setHomeMode(mode)
      return
    }
    setHomeMode(mode)
  }

  return (
    <div className="app">
      <header className="topbar">
        <h1 className="sr-only">속장</h1>
        {homeMode === 'stats' ? (
          <button type="button" className="icon-btn" onClick={goHome} aria-label="홈으로">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M4.5 11.2L12 4.8l7.5 6.4"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7 10.8V18.2c0 .7.5 1.2 1.2 1.2h2.8v-4.1h2v4.1h2.8c.7 0 1.2-.5 1.2-1.2v-7.4"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ) : (
          <span />
        )}
        <button
          type="button"
          className="icon-btn"
          onClick={() => setShowSettings(true)}
          aria-label="설정"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
            <path
              d="M12 3.5v2.2M12 18.3v2.2M4.9 6.4l1.6 1.5M17.5 16.1l1.6 1.5M3.5 12h2.2M18.3 12h2.2M4.9 17.6l1.6-1.5M17.5 7.9l1.6-1.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </header>

      {homeMode === 'calendar' ? (
        <Calendar
          year={year}
          month={month}
          selectedDate={selectedDate}
          entries={entries}
          onSelectDate={setSelectedDate}
          onChangeMonth={(y, m) => setMonth({ year: y, month: m })}
        />
      ) : null}

      {homeMode === 'quote' ? <QuoteHome entries={entries} /> : null}

      {homeMode === 'stats' ? <ReadingStats entries={entries} featured /> : null}

      {homeMode === 'calendar' ? (
        <>
          <div className="section-label">{selectedDate.replace(/-/g, '.')}</div>
          <EntryList
            entries={dayEntries}
            emptyText="이 날의 기록이 아직 없어요."
            onToggleFavorite={handleToggleFavorite}
            onDelete={handleDelete}
          />
        </>
      ) : null}

      {homeMode === 'stats' ? (
        <>
          <div className="stats-list-tabs segmented" role="tablist" aria-label="통계 목록">
            <button
              type="button"
              role="tab"
              aria-selected={statsListTab === 'finished'}
              className={statsListTab === 'finished' ? 'active' : ''}
              onClick={() => setStatsListTab('finished')}
            >
              다 읽은 책
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={statsListTab === 'passage'}
              className={statsListTab === 'passage' ? 'active' : ''}
              onClick={() => setStatsListTab('passage')}
            >
              구절
            </button>
          </div>
          {statsListTab === 'finished' ? (
            <EntryList
              entries={finishedEntries}
              emptyText="아직 다 읽은 책이 없어요. 완독 기록을 남기면 여기에 모입니다."
              onToggleFavorite={handleToggleFavorite}
              onDelete={handleDelete}
            />
          ) : (
            <EntryList
              entries={passageEntries}
              emptyText="아직 남긴 구절이 없어요."
              onToggleFavorite={handleToggleFavorite}
              onDelete={handleDelete}
            />
          )}
        </>
      ) : null}

      <ActionFab
        open={menuOpen}
        onToggle={() => setMenuOpen((v) => !v)}
        onFinished={() => openForm('finished')}
        onPassage={() => openForm('passage')}
        onStats={openStats}
      />

      {formKind ? (
        <EntryForm
          kind={formKind}
          initialDate={homeMode === 'calendar' ? selectedDate : todayISO()}
          onSave={handleSave}
          onClose={() => setFormKind(null)}
        />
      ) : null}

      {showSettings ? (
        <Settings
          homeMode={homeMode}
          onChangeHomeMode={handleChangeHomeMode}
          onClose={() => setShowSettings(false)}
        />
      ) : null}
    </div>
  )
}
