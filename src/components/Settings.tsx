import type { HomeMode } from '../types'

type Props = {
  homeMode: HomeMode
  onChangeHomeMode: (mode: HomeMode) => void
  onClose: () => void
}

export default function Settings({ homeMode, onChangeHomeMode, onClose }: Props) {
  function selectMode(mode: 'calendar' | 'quote') {
    onChangeHomeMode(mode)
    onClose()
  }

  return (
    <div className="overlay" onClick={onClose} role="presentation">
      <div
        className="sheet"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
      >
        <div className="sheet-header">
          <h2 id="settings-title" className="sheet-title">
            설정
          </h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="닫기">
            ✕
          </button>
        </div>

        <div className="settings-list">
          <div className="settings-item">
            <p>첫 화면에 무엇을 보여줄까요?</p>
            <div className="segmented" role="tablist">
              <button
                type="button"
                className={homeMode === 'calendar' || homeMode === 'stats' ? 'active' : ''}
                onClick={() => selectMode('calendar')}
              >
                달력
              </button>
              <button
                type="button"
                className={homeMode === 'quote' ? 'active' : ''}
                onClick={() => selectMode('quote')}
              >
                명언
              </button>
            </div>
          </div>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ink-faint)' }}>
            통계는 아래 기능 버튼에서 볼 수 있어요. 기록은 이 기기의 브라우저에만 저장됩니다.
          </p>
        </div>
      </div>
    </div>
  )
}
