import { useState, useRef, useCallback, useEffect } from 'react'

export function usePlayback(items, speed) {
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const timerRef = useRef(null)
  const indexRef = useRef(-1)

  const playableItems = items.filter(item => item.bopomofo !== null)

  const speakItem = useCallback((item) => {
    window.speechSynthesis.cancel()
    // char mode = Chinese character, syllable mode = pinyin string
    const text = item.char ?? item.syllable ?? ''
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-TW'
    utterance.rate = speed
    window.speechSynthesis.speak(utterance)
  }, [speed])

  // Map playable index → original items index
  const getOriginalIndex = useCallback((playableIdx) => {
    let count = -1
    for (let i = 0; i < items.length; i++) {
      if (items[i].bopomofo !== null) count++
      if (count === playableIdx) return i
    }
    return -1
  }, [items])

  const stop = useCallback(() => {
    setIsPlaying(false)
    clearTimeout(timerRef.current)
    window.speechSynthesis.cancel()
  }, [])

  const playFrom = useCallback((playableIdx) => {
    if (playableIdx >= playableItems.length) {
      setIsPlaying(false)
      return
    }
    indexRef.current = playableIdx
    const origIdx = getOriginalIndex(playableIdx)
    setCurrentIndex(origIdx)
    speakItem(items[origIdx])

    const delay = Math.max(400, 1200 / speed)
    timerRef.current = setTimeout(() => {
      playFrom(playableIdx + 1)
    }, delay)
  }, [playableItems.length, getOriginalIndex, items, speakItem, speed])

  const play = useCallback(() => {
    if (playableItems.length === 0) return
    setIsPlaying(true)
    const startIdx = indexRef.current < 0 || indexRef.current >= playableItems.length ? 0 : indexRef.current
    playFrom(startIdx)
  }, [playableItems.length, playFrom])

  const pause = useCallback(() => {
    setIsPlaying(false)
    clearTimeout(timerRef.current)
    window.speechSynthesis.cancel()
  }, [])

  const prev = useCallback(() => {
    clearTimeout(timerRef.current)
    window.speechSynthesis.cancel()
    const nxt = Math.max(0, indexRef.current - 1)
    indexRef.current = nxt
    const origIdx = getOriginalIndex(nxt)
    if (origIdx >= 0) {
      setCurrentIndex(origIdx)
      speakItem(items[origIdx])
    }
    if (isPlaying) {
      const delay = Math.max(400, 1200 / speed)
      timerRef.current = setTimeout(() => playFrom(nxt + 1), delay)
    }
  }, [getOriginalIndex, isPlaying, items, playFrom, speakItem, speed])

  const next = useCallback(() => {
    clearTimeout(timerRef.current)
    window.speechSynthesis.cancel()
    const nxt = Math.min(playableItems.length - 1, indexRef.current + 1)
    indexRef.current = nxt
    const origIdx = getOriginalIndex(nxt)
    if (origIdx >= 0) {
      setCurrentIndex(origIdx)
      speakItem(items[origIdx])
    }
    if (isPlaying) {
      const delay = Math.max(400, 1200 / speed)
      timerRef.current = setTimeout(() => playFrom(nxt + 1), delay)
    }
  }, [getOriginalIndex, isPlaying, items, playFrom, playableItems.length, speakItem, speed])

  const jumpTo = useCallback((origIdx) => {
    stop()
    let playableIdx = -1
    let count = -1
    for (let i = 0; i <= origIdx && i < items.length; i++) {
      if (items[i].bopomofo !== null) count++
      if (i === origIdx) playableIdx = count
    }
    if (playableIdx < 0) return
    indexRef.current = playableIdx
    setCurrentIndex(origIdx)
    speakItem(items[origIdx])
  }, [items, speakItem, stop])

  useEffect(() => {
    stop()
    setCurrentIndex(-1)
    indexRef.current = -1
  }, [items]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => { clearTimeout(timerRef.current); window.speechSynthesis.cancel() }, [])

  return { currentIndex, isPlaying, play, pause, stop, prev, next, jumpTo }
}
