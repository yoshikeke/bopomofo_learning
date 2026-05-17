async function translate(text, sl, tl) {
  if (!text || !text.trim()) return ''
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Translation failed')
  const data = await res.json()
  return data[0].map(seg => seg[0]).join('')
}

export function translateToJapanese(text) {
  return translate(text, 'zh-CN', 'ja')
}

export function translateToChinese(text) {
  return translate(text, 'ja', 'zh-TW')
}
