import { favoritePassages } from '../storage'
import type { BookEntry } from '../types'

type Props = {
  entries: BookEntry[]
}

export default function QuoteHome({ entries }: Props) {
  const quotes = favoritePassages(entries)

  if (quotes.length === 0) {
    return (
      <div className="panel quote-home">
        <p className="quote-empty">
          아직 남겨 둔 구절이 없어요.
          <br />
          읽다 마음에 남는 문장을 적어 보세요.
        </p>
      </div>
    )
  }

  const current = quotes[0]

  return (
    <div className="panel quote-home">
      <div className="quote-mark" aria-hidden>
        “
      </div>
      <p key={current.id} className="quote-text">
        {current.quote}
      </p>
      <div className="quote-meta">
        {current.title}
        {current.page != null ? ` · p.${current.page}` : ''}
      </div>
    </div>
  )
}
