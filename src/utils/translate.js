export async function translateToJapanese(text) {
  if (!text || !text.trim()) return ''
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=zh-CN&tl=ja&dt=t&q=${encodeURIComponent(text)}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Translation failed')
  const data = await res.json()
  return data[0].map(seg => seg[0]).join('')
}
