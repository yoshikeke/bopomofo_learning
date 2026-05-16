import { SYLLABLE_MAP, TONE_MARKS, TONE_COLORS } from './toBopomofo'

// Map toned vowels → [base vowel, tone number]
const ACCENTED = {
  ā: ['a', 1], á: ['a', 2], ǎ: ['a', 3], à: ['a', 4],
  ē: ['e', 1], é: ['e', 2], ě: ['e', 3], è: ['e', 4],
  ī: ['i', 1], í: ['i', 2], ǐ: ['i', 3], ì: ['i', 4],
  ō: ['o', 1], ó: ['o', 2], ǒ: ['o', 3], ò: ['o', 4],
  ū: ['u', 1], ú: ['u', 2], ǔ: ['u', 3], ù: ['u', 4],
  ǖ: ['ü', 1], ǘ: ['ü', 2], ǚ: ['ü', 3], ǜ: ['ü', 4],
}

function stripAccents(syllable) {
  let tone = 5
  let base = ''
  for (const ch of syllable) {
    if (ACCENTED[ch]) {
      const [v, t] = ACCENTED[ch]
      base += v
      tone = t
    } else {
      base += ch
    }
  }
  // Also support numeric tones: "ni3"
  const numMatch = base.match(/^(.*?)([1-5])$/)
  if (numMatch) {
    base = numMatch[1]
    tone = parseInt(numMatch[2])
  }
  // Normalize v → ü
  base = base.replace(/v/g, 'ü')
  return { base, tone }
}

// Convert a whitespace-separated pinyin string to bopomofo items
// Returns [{ syllable, bopomofo, tone, color }]
export function parsePinyinInput(input) {
  if (!input.trim()) return []

  // Split on whitespace; keep punctuation as separate tokens
  const tokens = input.trim().split(/(\s+|[，。！？、：；""''《》【】…—~,!?:;()[\]{}"'])/u)
    .filter(t => t && !/^\s+$/.test(t))

  return tokens.map(token => {
    // Punctuation / non-pinyin token
    if (/^[，。！？、：；""''《》【】…—~,!?:;()[\]{}"']$/.test(token)) {
      return { syllable: token, bopomofo: null, tone: null, color: null }
    }

    const { base, tone } = stripAccents(token.toLowerCase())
    const zhuyinBase = SYLLABLE_MAP[base]

    if (!zhuyinBase) {
      // Unknown syllable - pass through
      return { syllable: token, bopomofo: null, tone: null, color: null }
    }

    const mark = TONE_MARKS[tone] ?? ''
    return {
      syllable: token,
      bopomofo: zhuyinBase + mark,
      tone,
      color: TONE_COLORS[tone] ?? TONE_COLORS[5],
    }
  })
}
