import { useState } from 'react'
import type { BookEntry } from '../types'

type Props = {
  entries: BookEntry[]
  emptyText: string
  onToggleFavorite: (id: string) => void
  onDelete: (id: string) => void
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split('-')
  return `${y}.${m}.${d}`
}

export default function EntryList({
  entries,
  emptyText,
  onToggleFavorite,
  onDelete,
}: Props) {
  const [pendingDelete, setPendingDelete] = useState<BookEntry | null>(null)

  if (entries.length === 0) {
    return <p className="empty-hint">{emptyText}</p>
  }

  function requestDelete(entry: BookEntry) {
    if (entry.kind === 'passage') {
      setPendingDelete(entry)
      return
    }
    onDelete(entry.id)
  }

  function confirmDelete() {
    if (!pendingDelete) return
    onDelete(pendingDelete.id)
    setPendingDelete(null)
  }

  return (
    <>
      <div className="entry-list">
        {entries.map((entry) => (
          <article key={entry.id} className="entry-item">
            <div className="entry-kind">
              {entry.kind === 'finished' ? '다 읽은 책' : '마음에 남는 구절'}
            </div>
            <h3 className="entry-title">{entry.title}</h3>
            {entry.kind === 'finished' ? (
              <p className="entry-body">{entry.review}</p>
            ) : (
              <p className="entry-quote">{entry.quote}</p>
            )}
            <div className="entry-meta">
              <span>{formatDate(entry.date)}</span>
              {entry.kind === 'finished' && entry.publisher ? (
                <span>{entry.publisher}</span>
              ) : null}
              {entry.kind === 'finished' && entry.pages != null ? (
                <span>{entry.pages}쪽</span>
              ) : null}
              {entry.kind === 'passage' && entry.page != null ? (
                <span>p.{entry.page}</span>
              ) : null}
              <div className="entry-actions">
                {entry.kind === 'passage' ? (
                  <button
                    type="button"
                    className="text-btn"
                    onClick={() => onToggleFavorite(entry.id)}
                  >
                    {entry.favorite ? '첫 화면 해제' : '첫 화면에'}
                  </button>
                ) : null}
                <button
                  type="button"
                  className="text-btn danger"
                  onClick={() => requestDelete(entry)}
                >
                  삭제
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {pendingDelete ? (
        <div
          className="overlay"
          onClick={() => setPendingDelete(null)}
          role="presentation"
        >
          <div
            className="sheet confirm-sheet"
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-confirm-title"
            aria-describedby="delete-confirm-desc"
          >
            <h2 id="delete-confirm-title" className="sheet-title">
              구절을 삭제할까요?
            </h2>
            <p id="delete-confirm-desc" className="confirm-desc">
              삭제한 구절은 되돌릴 수 없어요.
            </p>
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setPendingDelete(null)}
              >
                취소
              </button>
              <button type="button" className="btn btn-danger" onClick={confirmDelete}>
                삭제
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
