import type { CSSProperties } from 'react'

type Props = {
  open: boolean
  onToggle: () => void
  onFinished: () => void
  onPassage: () => void
  onStats: () => void
}

export default function ActionFab({
  open,
  onToggle,
  onFinished,
  onPassage,
  onStats,
}: Props) {
  return (
    <div className={`fab-wrap${open ? ' open' : ''}`}>
      {open ? (
        <button
          type="button"
          className="fab-backdrop"
          aria-label="메뉴 닫기"
          onClick={onToggle}
        />
      ) : null}

      <div className="fab-menu" role="menu" aria-hidden={!open}>
        <button
          type="button"
          className="fab-action"
          role="menuitem"
          onClick={onFinished}
          style={{ '--i': 2 } as CSSProperties}
        >
          <span className="fab-action-label">책 다 읽음</span>
          <span className="fab-action-icon" aria-hidden>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12.5l4.2 4.2L19 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>
        <button
          type="button"
          className="fab-action"
          role="menuitem"
          onClick={onPassage}
          style={{ '--i': 1 } as CSSProperties}
        >
          <span className="fab-action-label">구절 남기기</span>
          <span className="fab-action-icon" aria-hidden>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M7 7.5h10M7 12h10M7 16.5h6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </button>
        <button
          type="button"
          className="fab-action"
          role="menuitem"
          onClick={onStats}
          style={{ '--i': 0 } as CSSProperties}
        >
          <span className="fab-action-label">통계 보기</span>
          <span className="fab-action-icon" aria-hidden>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 16.5V11M12 16.5V7.5M18 16.5v-3"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </button>
      </div>

      <button
        type="button"
        className={`fab${open ? ' fab-open' : ''}`}
        onClick={onToggle}
        aria-label={open ? '메뉴 닫기' : '기능 메뉴'}
        aria-expanded={open}
      >
        <span className="fab-plus" aria-hidden />
      </button>
    </div>
  )
}
