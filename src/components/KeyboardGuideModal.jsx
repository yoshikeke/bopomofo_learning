import { useEffect } from 'react'

const KB_GUIDE = [
  {
    os: '🖥️ Mac',
    steps: [
      'システム設定を開く',
      'サイドバーから「キーボード」を選択',
      '「入力ソース」の「編集…」をクリック',
      '「＋」ボタン →「中国語（繁体字）」→「拼音」を選んで追加',
      '右上の入力メニューアイコンで切り替え',
    ],
  },
  {
    os: '🪟 Windows',
    steps: [
      '設定 →「時刻と言語」→「言語と地域」',
      '「言語の追加」→「中文（繁體，台灣）」を選択',
      '言語オプション →「Microsoft 注音」をインストール',
      'タスクバーの入力インジケーターで切り替え',
    ],
  },
  {
    os: '📱 iPhone / iPad',
    steps: [
      '「設定」→「一般」→「キーボード」',
      '「新しいキーボードを追加」をタップ',
      '「中国語（繁体字）」→「拼音－QWERTY」を選択して追加',
      '入力中は🌐ボタンで切り替え',
    ],
  },
  {
    os: '🤖 Android（Gboard）',
    steps: [
      '設定 →「システム」→「キーボード」→「画面キーボード」',
      '「Gboard」→「言語」→「キーボードを追加」',
      '「繁體中文」→「拼音」を選んで追加',
      'スペースバー長押しで切り替え',
    ],
  },
]

const HOME_GUIDE = [
  {
    os: '🤖 Android',
    steps: [
      'Chromeでこのアプリを開く',
      '右上の「⋮」（3つの点）をタップ',
      '「ホーム画面に追加」を選択',
    ],
  },
  {
    os: '📱 iPhone / iPad',
    steps: [
      'Safariでこのアプリを開く（※Safari限定）',
      '下部の共有ボタン（□に↑のアイコン）をタップ',
      '「もっと見る」をタップ',
      '「ホーム画面に追加」を選択',
    ],
  },
  {
    os: '🖥️ パソコン',
    steps: [
      'ブラウザでこのアプリを開く',
      'ブックマーク（お気に入り）に追加するのがおすすめです',
    ],
  },
]

export default function KeyboardGuideModal({ onClose }) {
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal-header">
          <h2 className="modal-title">⚙️ 便利な設定</h2>
          <button className="modal-close" onClick={onClose} aria-label="閉じる">✕</button>
        </div>
        <div className="modal-body">
          <h3 className="modal-section-title">⌨️ 中国語（繁体字）キーボードの追加</h3>
          <p className="modal-intro">
            華語を入力するには、お使いの端末で<strong>中国語（繁体字）</strong>のキーボードを追加してください。
            追加後は入力メニューから切り替えて使用できます。
          </p>
          <div className="kb-guide-grid">
            {KB_GUIDE.map(({ os, steps }) => (
              <div key={os} className="kb-guide-card">
                <div className="kb-guide-os">{os}</div>
                <ol className="kb-guide-steps">
                  {steps.map((s, i) => <li key={i}>{s}</li>)}
                </ol>
              </div>
            ))}
          </div>

          <h3 className="modal-section-title">📲 ホーム画面に追加</h3>
          <p className="modal-intro">
            ホーム画面に追加すると、アプリのようにすぐ起動できます。
          </p>
          <div className="kb-guide-grid">
            {HOME_GUIDE.map(({ os, steps }) => (
              <div key={os} className="kb-guide-card">
                <div className="kb-guide-os">{os}</div>
                <ol className="kb-guide-steps">
                  {steps.map((s, i) => <li key={i}>{s}</li>)}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
