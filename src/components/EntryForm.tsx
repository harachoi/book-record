import { useState, type FormEvent } from 'react'
import { createId, todayISO } from '../storage'
import type { BookEntry, EntryKind } from '../types'

type Props = {
  kind: EntryKind
  initialDate?: string
  onSave: (entry: BookEntry) => void
  onClose: () => void
}

export default function EntryForm({ kind, initialDate, onSave, onClose }: Props) {
  const [date, setDate] = useState(initialDate ?? todayISO())
  const [title, setTitle] = useState('')
  const [pages, setPages] = useState('')
  const [publisher, setPublisher] = useState('')
  const [review, setReview] = useState('')
  const [page, setPage] = useState('')
  const [quote, setQuote] = useState('')
  const [favorite, setFavorite] = useState(true)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) return

    if (kind === 'finished') {
      if (!review.trim()) return
      onSave({
        id: createId(),
        kind: 'finished',
        date,
        title: title.trim(),
        pages: pages ? Number(pages) : undefined,
        publisher: publisher.trim() || undefined,
        review: review.trim(),
        createdAt: new Date().toISOString(),
      })
      return
    }

    if (!quote.trim()) return
    onSave({
      id: createId(),
      kind: 'passage',
      date,
      title: title.trim(),
      page: page ? Number(page) : undefined,
      quote: quote.trim(),
      favorite,
      createdAt: new Date().toISOString(),
    })
  }

  return (
    <div className="overlay" onClick={onClose} role="presentation">
      <div
        className="sheet"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="entry-form-title"
      >
        <div className="sheet-header">
          <h2 id="entry-form-title" className="sheet-title">
            {kind === 'finished' ? '책 다 읽음' : '구절 남기기'}
          </h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="닫기">
            ✕
          </button>
        </div>

        <form className="form-stack" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="entry-date">날짜</label>
            <input
              id="entry-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="entry-title">책 제목</label>
            <input
              id="entry-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              required
              autoFocus
            />
          </div>

          {kind === 'finished' ? (
            <>
              <div className="field">
                <label htmlFor="entry-pages">총 페이지 수 (선택)</label>
                <input
                  id="entry-pages"
                  type="number"
                  min={1}
                  value={pages}
                  onChange={(e) => setPages(e.target.value)}
                  placeholder="예: 312"
                />
              </div>
              <div className="field">
                <label htmlFor="entry-publisher">출판사 (선택)</label>
                <input
                  id="entry-publisher"
                  value={publisher}
                  onChange={(e) => setPublisher(e.target.value)}
                  placeholder="예: 민음사"
                />
              </div>
              <div className="field">
                <label htmlFor="entry-review">한줄 평</label>
                <textarea
                  id="entry-review"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="이 책에 대한 짧은 생각"
                  required
                />
              </div>
            </>
          ) : (
            <>
              <div className="field">
                <label htmlFor="entry-page">페이지 (선택)</label>
                <input
                  id="entry-page"
                  type="number"
                  min={1}
                  value={page}
                  onChange={(e) => setPage(e.target.value)}
                  placeholder="예: 48"
                />
              </div>
              <div className="field">
                <label htmlFor="entry-quote">구절</label>
                <textarea
                  id="entry-quote"
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="마음에 남은 문장을 적어 주세요"
                  required
                />
              </div>
              <label className="check-row">
                <input
                  type="checkbox"
                  checked={favorite}
                  onChange={(e) => setFavorite(e.target.checked)}
                />
                첫 화면 명언으로 쓰기
              </label>
            </>
          )}

          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              취소
            </button>
            <button type="submit" className="btn btn-primary">
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
