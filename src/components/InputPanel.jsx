import { useState, useEffect } from 'react'
import ImageCapture from './ImageCapture'
import { translateToChinese } from '../utils/translate'

const VALID_TABS = ['text', 'image', 'japanese']

export default function InputPanel({ onConvert }) {
  const [tab, setTab] = useState(() => {
    const saved = localStorage.getItem('inputTab')
    return VALID_TABS.includes(saved) ? saved : 'text'
  })

  useEffect(() => {
    localStorage.setItem('inputTab', tab)
  }, [tab])
  const [text, setText] = useState('')
  const [jaText, setJaText] = useState('')
  const [translating, setTranslating] = useState(false)

  function handleOcrText(recognized) {
    setText(recognized)
    if (recognized.trim()) onConvert({ mode: 'char', text: recognized })
  }

  function handleTextKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (text.trim()) onConvert({ mode: 'char', text })
    }
  }

  function handleJaKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (jaText.trim()) handleJaConvert()
    }
  }

  async function handleJaConvert() {
    if (!jaText.trim() || translating) return
    setTranslating(true)
    try {
      const chinese = await translateToChinese(jaText)
      setText(chinese)
      onConvert({ mode: 'char', text: chinese })
    } catch {
      alert('翻訳に失敗しました。もう一度お試しください。')
    } finally {
      setTranslating(false)
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
        <button className={`tab ${tab === 'japanese' ? 'tab--active' : ''}`} onClick={() => setTab('japanese')}>
          🇯🇵 日本語から変換
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

      {tab === 'japanese' && (
        <>
          <div className="text-input-area">
            <textarea
              className="text-input"
              placeholder="日本語を入力（例：お元気ですか？）&#10;Enterで変換、Shift+Enterで改行"
              value={jaText}
              onChange={e => setJaText(e.target.value)}
              onKeyDown={handleJaKeyDown}
              rows={4}
            />
          </div>
          <div className="input-footer">
            <span className="input-hint">日本語→中国語に翻訳して変換</span>
            <button className="btn-primary" onClick={handleJaConvert} disabled={!jaText.trim() || translating}>
              {translating ? '翻訳中...' : '変換する →'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
