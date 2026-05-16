import { useState } from 'react'
import ImageCapture from './ImageCapture'

export default function InputPanel({ onConvert }) {
  const [tab, setTab] = useState('text')
  const [text, setText] = useState('')

  function handleOcrText(recognized) {
    setText(recognized)
    setTab('text')
  }

  function handleTextKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (text.trim()) onConvert({ mode: 'char', text })
    }
  }

  return (
    <div className="input-panel">
      <div className="tab-bar">
        <button className={`tab ${tab === 'text' ? 'tab--active' : ''}`} onClick={() => setTab('text')}>
          ✍️ テキスト入力
        </button>
        <button className={`tab ${tab === 'image' ? 'tab--active' : ''}`} onClick={() => setTab('image')}>
          📷 画像から読取
        </button>
      </div>

      {tab === 'text' && (
        <>
          <div className="text-input-area">
            <textarea
              className="text-input"
              placeholder="華語テキストを入力（例：你好嗎？）&#10;Enterで変換、Shift+Enterで改行"
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={handleTextKeyDown}
              rows={4}
            />
          </div>
          <div className="input-footer">
            <span className="input-hint">Enterキーで変換</span>
            <button className="btn-primary" onClick={() => onConvert({ mode: 'char', text })} disabled={!text.trim()}>
              変換する →
            </button>
          </div>
        </>
      )}

      {tab === 'image' && (
        <>
          <ImageCapture onTextReady={handleOcrText} />
          {text && (
            <div className="ocr-result">
              <p className="ocr-result-label">認識されたテキスト（編集可能）：</p>
              <textarea
                className="text-input"
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={handleTextKeyDown}
                rows={3}
              />
              <button className="btn-primary" onClick={() => onConvert({ mode: 'char', text })} disabled={!text.trim()}>
                変換する →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
