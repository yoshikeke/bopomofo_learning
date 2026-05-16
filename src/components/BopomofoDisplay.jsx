// Items can be either character mode: { char, bopomofo, tone, color }
// or pinyin mode: { syllable, bopomofo, tone, color }
export default function BopomofoDisplay({ items, currentIndex, onClickChar }) {
  if (!items || items.length === 0) {
    return (
      <div className="bopo-empty">
        テキストを入力して「変換」を押してください
      </div>
    )
  }

  return (
    <div className="bopo-grid">
      {items.map((item, i) => {
        const isActive = i === currentIndex
        const label = item.char ?? item.syllable
        const isPlayable = item.bopomofo !== null

        return (
          <div
            key={i}
            className={`bopo-card ${isActive ? 'bopo-card--active' : ''} ${isPlayable ? 'bopo-card--chinese' : 'bopo-card--symbol'}`}
            onClick={() => isPlayable && onClickChar && onClickChar(i)}
            style={isPlayable ? { cursor: 'pointer' } : {}}
            title={isPlayable ? 'クリックで再生' : undefined}
          >
            {isPlayable && (
              <span className="bopo-ruby" style={{ color: item.color }}>
                {item.bopomofo}
              </span>
            )}
            <span className="bopo-char">{label}</span>
          </div>
        )
      })}
    </div>
  )
}
