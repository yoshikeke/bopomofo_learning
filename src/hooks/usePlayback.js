import { useState, useRef, useCallback, useEffect } from 'react'

export function usePlayback(items, interval) {
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const timerRef = useRef(null)
  const indexRef = useRef(-1)

  const playableItems = items.filter(item => item.bopomofo !== null)

  // Map playable index -> original items index
  function getOriginalIndex(playableIdx) {
    let count = -1
    for (let i = 0; i < items.length; i++) {
      if (items[i].bopomofo !== null) count++
      if (count === playableIdx) return i
    }
    return -1
  }

  function speakAt(playableIdx) {
    window.speechSynthesis.cancel()
    const origIdx = getOriginalIndex(playableIdx)
    if (origIdx < 0) return
    const item = items[origIdx]
    const text = item.char ?? item.syllable ?? ''
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-TW'
    utterance.rate = 1.0
    utterance.volume = 1.0
    window.speechSynthesis.speak(utterance)
    indexRef.current = playableIdx
    setCurrentIndex(origIdx)
  }

  // Auto-advance effect: when playing, schedule next step after interval
  useEffect(() => {
    if (!isPlaying) return
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      const next = indexRef.current + 1
      if (next >= playableItems.length) {
        setIsPlaying(false)
        return
      }
      speakAt(next)
    }, interval)
    return () => clearTimeout(timerRef.current)
  }, [isPlaying, currentIndex, interval, playableItems.length]) // eslint-disable-line react-hooks/exhaustive-deps

  const play = useCallback(() => {
    if (playableItems.length === 0) return
    const startIdx = indexRef.current < 0 || indexRef.current >= playableItems.length ? 0 : indexRef.current
    speakAt(startIdx)
    setIsPlaying(true)
  }, [playableItems.length, items]) // eslint-disable-line react-hooks/exhaustive-deps

  const pause = useCallback(() => {
    setIsPlaying(false)
    clearTimeout(timerRef.current)
    window.speechSynthesis.cancel()
  }, [])

  const stop = useCallback(() => {
    setIsPlaying(false)
    clearTimeout(timerRef.current)
    window.speechSynthesis.cancel()
  }, [])

  const prev = useCallback(() => {
    const nxt = Math.max(0, indexRef.current - 1)
    speakAt(nxt)
  }, [items]) // eslint-disable-line react-hooks/exhaustive-deps

  const next = useCallback(() => {
    const nxt = Math.min(playableItems.length - 1, indexRef.current + 1)
    speakAt(nxt)
  }, [playableItems.length, items]) // eslint-disable-line react-hooks/exhaustive-deps

  const jumpTo = useCallback((origIdx) => {
    setIsPlaying(false)
    clearTimeout(timerRef.current)
    window.speechSynthesis.cancel()
    let playableIdx = -1
    let count = -1
    for (let i = 0; i <= origIdx && i < items.length; i++) {
      if (items[i].bopomofo !== null) count++
      if (i === origIdx) playableIdx = count
    }
    if (playableIdx < 0) return
    speakAt(playableIdx)
  }, [items]) // eslint-disable-line react-hooks/exhaustive-deps

  const reset = useCallback(() => {
    setIsPlaying(false)
    clearTimeout(timerRef.current)
    window.speechSynthesis.cancel()
    setCurrentIndex(-1)
    indexRef.current = -1
  }, [])

  // Cleanup on unmount
  useEffect(() => () => { clearTimeout(timerRef.current); window.speechSynthesis.cancel() }, [])

  return { currentIndex, isPlaying, play, pause, stop, reset, prev, next, jumpTo }
}
