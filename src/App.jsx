import { useState, useEffect } from 'react'
import InputPanel from './components/InputPanel'
import BopomofoDisplay from './components/BopomofoDisplay'
import PlaybackControls from './components/PlaybackControls'
import KeyboardGuideModal from './components/KeyboardGuideModal'
import PronunciationGuide from './pages/PronunciationGuide'
import { convertToBopomofo } from './utils/toBopomofo'
import { usePlayback } from './hooks/usePlayback'
import { translateToJapanese } from './utils/translate'
import './App.css'

export default function App() {
  const [page, setPage] = useState('learn')
  const [items, setItems] = useState([])
  const [speed, setSpeed] = useState(0.8)
  const [showKbModal, setShowKbModal] = useState(false)
  const [originalText, setOriginalText] = useState('')
  const [japaneseText, setJapaneseText] = useState('')

  const { currentIndex, isPlaying, play, pause, prev, next, jumpTo } = usePlayback(items, speed)

  useEffect(() => {
    if (!originalText) { setJapaneseText(''); return }
    let cancelled = false
    translateToJapanese(originalText).then(result => {
      if (!cancelled) setJapaneseText(result)
    }).catch(() => {
      if (!cancelled) setJapaneseText('翻訳に失敗しました')
    })
    return () => { cancelled = true }
  }, [originalText])

  function handleConvert({ text }) {
    if (!text.trim()) return
    setOriginalText(text)
    setItems(convertToBopomofo(text))
  }

  const hasItems = items.length > 0

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-inner">
          <div>
            <h1>ㄅㄆㄇㄈ 注音符號 学習アプリ</h1>
            <p className="app-subtitle">漢字をボポモフォに変換して発音を練習</p>
          </div>
          <nav className="app-nav">
            <button
              className={`nav-btn ${page === 'learn' ? 'nav-btn--active' : ''}`}
              onClick={() => setPage('learn')}
            >
              📚 学習
            </button>
            <button
              className={`nav-btn ${page === 'guide' ? 'nav-btn--active' : ''}`}
              onClick={() => setPage('guide')}
            >
              🔤 発音ガイド
            </button>
            <button className="nav-btn" onClick={() => setShowKbModal(true)}>
              ⌨️ 入力設定
            </button>
          </nav>
        </div>
      </header>

      <main className="app-main">
        {page === 'guide' ? (
          <PronunciationGuide />
        ) : (
          <>
            <section className="section-input">
              <InputPanel onConvert={handleConvert} />
            </section>

            {hasItems && (
              <>
                <section className="section-display">
                  <div className="tone-legend">
                    <span style={{ color: '#2563eb' }}>■ 1声</span>
                    <span style={{ color: '#16a34a' }}>■ 2声</span>
                    <span style={{ color: '#ea580c' }}>■ 3声</span>
                    <span style={{ color: '#dc2626' }}>■ 4声</span>
                    <span style={{ color: '#6b7280' }}>■ 軽声</span>
                    <span className="legend-hint">（文字をクリックで個別再生）</span>
                  </div>
                  <BopomofoDisplay
                    items={items}
                    currentIndex={currentIndex}
                    onClickChar={jumpTo}
                  />
                </section>

                <section className="section-controls">
                  <PlaybackControls
                    isPlaying={isPlaying}
                    onPlay={play}
                    onPause={pause}
                    onPrev={prev}
                    onNext={next}
                    speed={speed}
                    onSpeedChange={setSpeed}
                    disabled={!hasItems}
                  />
                </section>

                {japaneseText && (
                  <section className="section-translation">
                    <div className="translation-box">
                      <span className="translation-label">日本語訳</span>
                      <p className="translation-text">{japaneseText}</p>
                    </div>
                  </section>
                )}
              </>
            )}
          </>
        )}
      </main>

      {showKbModal && <KeyboardGuideModal onClose={() => setShowKbModal(false)} />}
    </div>
  )
}
