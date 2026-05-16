import { useState } from 'react'

// ── Data ──────────────────────────────────────────────────────────────────
const INITIALS = [
  {
    symbol: 'ㄅ', pinyin: 'b', example: 'bā 八',
    steps: ['両唇をしっかり閉じる', '息を出さずに一気に弾く（無気音）', '日本語「バ」より短く・息を使わない'],
  },
  {
    symbol: 'ㄆ', pinyin: 'p', example: 'pā 趴',
    steps: ['両唇をしっかり閉じる', '弾くと同時に強く息を吐き出す（有気音）', '手を口の前に出すと息が当たる感覚'],
  },
  {
    symbol: 'ㄇ', pinyin: 'm', example: 'mā 媽',
    steps: ['両唇を閉じ鼻から声を出す（鼻音）', '日本語「マ行」とほぼ同じ感覚'],
  },
  {
    symbol: 'ㄈ', pinyin: 'f', example: 'fā 發',
    steps: ['上の前歯を軽く下唇に当てる', '隙間から息を摩擦させる', '日本語「ファ」に近い'],
  },
  {
    symbol: 'ㄉ', pinyin: 'd', example: 'dā 搭',
    steps: ['舌先を上歯茎の裏に当てる', '息を出さずに弾く（無気音）', '日本語「ダ」より息を出さない'],
  },
  {
    symbol: 'ㄊ', pinyin: 't', example: 'tā 他',
    steps: ['舌先を上歯茎の裏に当てる', '弾くと同時に強く息を吐き出す（有気音）', '日本語「タ」に近い'],
  },
  {
    symbol: 'ㄋ', pinyin: 'n', example: 'nā 拿',
    steps: ['舌先を上歯茎に当てて鼻から声を出す（鼻音）', '日本語「ナ行」とほぼ同じ'],
  },
  {
    symbol: 'ㄌ', pinyin: 'l', example: 'lā 啦',
    steps: ['舌先を上歯茎に当てる', '舌の両側から声を流す（側面音）', '日本語「ラ行」に近い'],
  },
  {
    symbol: 'ㄍ', pinyin: 'g', example: 'gē 哥',
    steps: ['舌の奥を軟口蓋に押し当てる', '息を出さずに弾く（無気音）', '日本語「ガ」より息を出さない'],
  },
  {
    symbol: 'ㄎ', pinyin: 'k', example: 'kē 科',
    steps: ['舌の奥を軟口蓋に押し当てる', '弾くと同時に強く息を吐く（有気音）', '日本語「カ」に近い'],
  },
  {
    symbol: 'ㄏ', pinyin: 'h', example: 'hē 喝',
    steps: ['喉の奥（軟口蓋付近）を狭めて息を摩擦させる', '日本語「ハ」より喉の奥から出す'],
  },
  {
    symbol: 'ㄐ', pinyin: 'j', example: 'jī 雞',
    steps: ['舌面（舌の中央）を硬口蓋に当てる', '息を出さずに弾く（無気音）', '「ジ」より舌を前・上に置く', 'ㄧ・ㄩの前でしか使わない'],
  },
  {
    symbol: 'ㄑ', pinyin: 'q', example: 'qī 七',
    steps: ['舌面を硬口蓋に当て強く息を吐く（有気音）', '「チ」より舌を前・上に置く', 'ㄧ・ㄩの前でしか使わない'],
  },
  {
    symbol: 'ㄒ', pinyin: 'x', example: 'xī 西',
    steps: ['舌面を硬口蓋に近づけて摩擦させる', '「シ」より舌を前・上に置く', 'ㄧ・ㄩの前でしか使わない'],
  },
  {
    symbol: 'ㄓ', pinyin: 'zh', example: 'zhē 遮',
    steps: ['舌先を反らせて（巻き舌）口の奥側の硬口蓋に当てる', '息を出さずに弾く（無気音）', '英語の「j」に近い巻き舌音'],
  },
  {
    symbol: 'ㄔ', pinyin: 'ch', example: 'chē 車',
    steps: ['ㄓと同じ位置で強く息を吐く（有気音）', '英語の「ch」に近い巻き舌音'],
  },
  {
    symbol: 'ㄕ', pinyin: 'sh', example: 'shē 奢',
    steps: ['舌先を反らせて口の奥側に近づける', '摩擦させながら息を出す', '英語の「sh」に近い巻き舌音'],
  },
  {
    symbol: 'ㄖ', pinyin: 'r', example: 'rè 熱',
    steps: ['ㄕと同じ舌の位置', '声帯を振動させながら摩擦（有声摩擦音）', '英語の「r」と「zh」の中間のような音'],
  },
  {
    symbol: 'ㄗ', pinyin: 'z', example: 'zì 字',
    steps: ['舌先を上歯茎の裏に当てる', 'ゆっくり離しながら摩擦を起こす（破擦音）', '息を出さない（無気音）', '日本語「ズ」に近いが息を出さない'],
  },
  {
    symbol: 'ㄘ', pinyin: 'c', example: 'cì 刺',
    steps: ['ㄗと同じ位置で強く息を吐く（有気音）', '日本語「ツ」に近い'],
  },
  {
    symbol: 'ㄙ', pinyin: 's', example: 'sì 四',
    steps: ['舌先を上歯茎に近づけて摩擦させる', '日本語「ス」とほぼ同じ'],
  },
]

const MEDIALS = [
  {
    symbol: 'ㄧ', pinyin: 'i / y', example: 'yī 一',
    steps: ['唇を左右に引っ張るように伸ばす', '日本語「イ」と同じ感覚', '子音の後では「i」、単独では「yi」と書く'],
  },
  {
    symbol: 'ㄨ', pinyin: 'u / w', example: 'wū 屋',
    steps: ['唇を丸くすぼめる', '日本語「ウ」と同じ感覚', '子音の後では「u」、単独では「wu」と書く'],
  },
  {
    symbol: 'ㄩ', pinyin: 'ü / yu', example: 'yú 魚',
    steps: ['「イ」の口の形をキープしたまま', '「ウ」と発音する（唇を丸める）', 'フランス語の「u」と同じ音', '日本語にない音なので練習が必要'],
  },
]

const FINALS = [
  {
    symbol: 'ㄚ', pinyin: 'a', example: 'bā 八',
    steps: ['口を縦に大きく開ける', '舌は平らに下げる', '日本語「ア」より口を大きく開ける'],
  },
  {
    symbol: 'ㄛ', pinyin: 'o', example: 'bō 波',
    steps: ['唇を丸めてすぼめる', '日本語「オ」より唇をさらに丸く'],
  },
  {
    symbol: 'ㄜ', pinyin: 'e', example: 'gē 哥',
    steps: ['唇を丸めずに口を半開き', '舌を奥に引く', '「エ」と「オ」の中間のような曖昧母音'],
  },
  {
    symbol: 'ㄝ', pinyin: 'ê', example: 'jiē 街',
    steps: ['口を横に広げて「エ」', 'ㄧの後などに現れる（単独では稀）'],
  },
  {
    symbol: 'ㄞ', pinyin: 'ai', example: 'āi 哀',
    steps: ['「ア」から「イ」へ滑らかに移行', '日本語「アイ」に近い'],
  },
  {
    symbol: 'ㄟ', pinyin: 'ei', example: 'měi 美',
    steps: ['「エ」から「イ」へ滑らかに移行', '日本語「エイ」に近い', '※ 音声は「měi 美」（ㄇ＋ㄟ）で再生されます'],
  },
  {
    symbol: 'ㄠ', pinyin: 'ao', example: 'āo 凹',
    steps: ['「ア」から「オ」へ移行', '日本語「アオ」に近い'],
  },
  {
    symbol: 'ㄡ', pinyin: 'ou', example: 'ōu 歐',
    steps: ['「オ」から「ウ」へ移行', '日本語「オウ」に近い'],
  },
  {
    symbol: 'ㄢ', pinyin: 'an', example: 'ān 安',
    steps: ['「ア」から始め、舌先を上歯の裏に当てて「ン」で終わる', '前鼻音（舌先で終わる「ン」）'],
  },
  {
    symbol: 'ㄣ', pinyin: 'en', example: 'ēn 恩',
    steps: ['曖昧な「エ・ウ」から舌先を上歯茎に当てて「ン」で終わる', '前鼻音'],
  },
  {
    symbol: 'ㄤ', pinyin: 'ang', example: 'āng 昂',
    steps: ['「ア」から舌の奥を軟口蓋に当てて「ン」で終わる', '後鼻音（英語の "-ng" と同じ）'],
  },
  {
    symbol: 'ㄥ', pinyin: 'eng', example: 'chéng 城',
    steps: ['「エ・ウ」系の母音から舌の奥を上げて「ン」で終わる', '後鼻音（英語の "-ng" と同じ）', '※ 音声は「chéng 城」（ㄔ＋ㄥ）で再生されます'],
  },
  {
    symbol: 'ㄦ', pinyin: 'er', example: 'ér 兒',
    steps: ['「ア」から舌先を丸めながら（そり舌）発音', '英語の「er」に近いそり舌母音', '単独で音節になる（例：兒 ér）'],
  },
]

const TONES = [
  {
    mark: '（なし）', num: 1, color: '#2563eb', name: '第一声（陰平）',
    desc: '高く平らに伸ばす',
    steps: ['音を高く保ったまま一定に伸ばす', '上から引っ張られるような感覚', '例：媽 mā（お母さん）'],
    example: '媽',
  },
  {
    mark: 'ˊ', num: 2, color: '#16a34a', name: '第二声（陽平）',
    desc: '低から高へ急上昇',
    steps: ['低い音から高い音へ一気に上げる', '日本語の疑問のイントネーションに近い', '例：麻 má（麻痺/ゴマ）'],
    example: '麻',
  },
  {
    mark: 'ˇ', num: 3, color: '#ea580c', name: '第三声（上声）',
    steps: ['低く沈めてから少し上げる', '「ウッ」と声を低く落とす感じ', '連続する場合、前の第三声は第二声に変わる', '例：馬 mǎ（馬）'],
    desc: '低く沈める（少し上げる）',
    example: '馬',
  },
  {
    mark: 'ˋ', num: 4, color: '#dc2626', name: '第四声（去声）',
    desc: '高から低へ急降下',
    steps: ['高い音から一気に低く落とす', '強く断定するような感覚', '「ダン！」と叩きつける感じ', '例：罵 mà（罵る）'],
    example: '罵',
  },
  {
    mark: '˙', num: 5, color: '#6b7280', name: '軽声',
    desc: '短く軽く付け足す',
    steps: ['直前の音に軽く添えるだけ', '声調を気にせず短く弱く発音', '例：嗎 ma（〜ですか？の語気助詞）'],
    example: '嗎',
  },
]

// ── Components ────────────────────────────────────────────────────────────
function speak(text) {
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'zh-TW'
  u.rate = 0.7
  window.speechSynthesis.speak(u)
}

function Row({ item, speakText }) {
  return (
    <tr className="guide-row">
      <td className="guide-cell-symbol">
        <button
          className="guide-symbol-btn"
          onClick={() => speak(speakText ?? item.example.split(' ')[1] ?? item.example)}
          title="クリックで発音"
        >
          {item.symbol}
        </button>
      </td>
      <td className="guide-cell-pinyin">{item.pinyin}</td>
      <td className="guide-cell-example">{item.example}</td>
      <td className="guide-cell-steps">
        <ul className="guide-steps">
          {item.steps.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      </td>
    </tr>
  )
}

function ToneRow({ tone }) {
  return (
    <tr className="guide-row">
      <td className="guide-cell-symbol">
        <button
          className="guide-symbol-btn guide-symbol-btn--tone"
          style={{ color: tone.color }}
          onClick={() => speak(tone.example)}
          title="クリックで発音"
        >
          {tone.mark === '（なし）' ? 'ˉ' : tone.mark}
        </button>
      </td>
      <td className="guide-cell-pinyin" style={{ color: tone.color, fontWeight: 700 }}>{tone.name}</td>
      <td className="guide-cell-example">
        <button className="guide-example-btn" onClick={() => speak(tone.example)}>
          {tone.example}（{tone.desc}）
        </button>
      </td>
      <td className="guide-cell-steps">
        <ul className="guide-steps">
          {tone.steps.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      </td>
    </tr>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function PronunciationGuide() {
  const [section, setSection] = useState('initials')

  return (
    <div className="guide-page">
      <div className="guide-nav">
        {[
          { id: 'initials', label: '① 声母（子音）' },
          { id: 'medials', label: '② 介母' },
          { id: 'finals', label: '③ 韻母（母音）' },
          { id: 'tones', label: '④ 声調' },
        ].map(s => (
          <button
            key={s.id}
            className={`guide-tab ${section === s.id ? 'guide-tab--active' : ''}`}
            onClick={() => setSection(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="guide-section">
        {section === 'tones' && (
          <>
            <p className="guide-intro">
              同じ音でも声調（音の高低パターン）が違うと意味が変わります。<br />
              <strong>声調記号はボポモフォの右側</strong>に付きます（第一声は省略）。<br />
              行をクリックすると発音が聞けます。
            </p>
            <table className="guide-table">
              <thead>
                <tr>
                  <th>記号</th>
                  <th>名前</th>
                  <th>例</th>
                  <th>口の動かし方・コツ</th>
                </tr>
              </thead>
              <tbody>
                {TONES.map(t => <ToneRow key={t.num} tone={t} />)}
              </tbody>
            </table>
            <div className="tone-diagram">
              <p className="guide-intro" style={{ marginBottom: 8 }}>音の高低イメージ（5段階）：</p>
              <pre className="tone-chart">{`高 ⑤  ─────                      ─
   ④        ╲              (軽声は
   ③          ╲   ╭──╮   直前の音
   ②   第1声   ╲─╯ 第3声  に依存)
低 ①      第2声↗    第4声↘`}</pre>
            </div>
          </>
        )}

        {section === 'initials' && (
          <>
            <p className="guide-intro">
              子音（声母）21種。ボポモフォ記号をクリックすると発音が聞けます。<br />
              <strong>無気音</strong>（息を出さない）と<strong>有気音</strong>（息を強く出す）の区別に注意。
            </p>
            <table className="guide-table">
              <thead>
                <tr><th>記号</th><th>ピンイン</th><th>例</th><th>口の動かし方・コツ</th></tr>
              </thead>
              <tbody>
                {INITIALS.map(item => <Row key={item.symbol} item={item} speakText={item.example.split(' ')[1]} />)}
              </tbody>
            </table>
          </>
        )}

        {section === 'medials' && (
          <>
            <p className="guide-intro">
              介母（中間音）3種。子音と母音の間に入る母音で、単独で音節にもなります。<br />
              記号をクリックすると発音が聞けます。
            </p>
            <table className="guide-table">
              <thead>
                <tr><th>記号</th><th>ピンイン</th><th>例</th><th>口の動かし方・コツ</th></tr>
              </thead>
              <tbody>
                {MEDIALS.map(item => <Row key={item.symbol} item={item} speakText={item.example.split(' ')[1]} />)}
              </tbody>
            </table>
          </>
        )}

        {section === 'finals' && (
          <>
            <p className="guide-intro">
              母音・韻尾（韻母）13種。音節の核となる母音と末尾の鼻音など。<br />
              記号をクリックすると発音が聞けます。
            </p>
            <table className="guide-table">
              <thead>
                <tr><th>記号</th><th>ピンイン</th><th>例</th><th>口の動かし方・コツ</th></tr>
              </thead>
              <tbody>
                {FINALS.map(item => <Row key={item.symbol} item={item} speakText={item.example.split(' ')[1]} />)}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  )
}
