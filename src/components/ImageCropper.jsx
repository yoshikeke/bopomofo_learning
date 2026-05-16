import { useRef, useState } from 'react'

export default function ImageCropper({ imageSrc, onCrop, onSkip }) {
  const imgRef = useRef()
  const containerRef = useRef()
  const [sel, setSel] = useState(null)
  const startRef = useRef(null)
  const draggingRef = useRef(false)

  function clientToImg(clientX, clientY) {
    const rect = containerRef.current.getBoundingClientRect()
    return {
      x: Math.max(0, Math.min(clientX - rect.left, rect.width)),
      y: Math.max(0, Math.min(clientY - rect.top, rect.height)),
    }
  }

  function onDown(e) {
    e.preventDefault()
    const { clientX, clientY } = e.touches ? e.touches[0] : e
    const pos = clientToImg(clientX, clientY)
    startRef.current = pos
    draggingRef.current = true
    setSel({ x: pos.x, y: pos.y, w: 0, h: 0 })
  }

  function onMove(e) {
    if (!draggingRef.current) return
    e.preventDefault()
    const { clientX, clientY } = e.touches ? e.touches[0] : e
    const pos = clientToImg(clientX, clientY)
    const s = startRef.current
    setSel({
      x: Math.min(s.x, pos.x),
      y: Math.min(s.y, pos.y),
      w: Math.abs(pos.x - s.x),
      h: Math.abs(pos.y - s.y),
    })
  }

  function onUp() {
    draggingRef.current = false
  }

  async function handleCrop() {
    if (!sel || sel.w < 10 || sel.h < 10) return
    const img = imgRef.current
    const scaleX = img.naturalWidth / img.clientWidth
    const scaleY = img.naturalHeight / img.clientHeight
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(sel.w * scaleX)
    canvas.height = Math.round(sel.h * scaleY)
    canvas.getContext('2d').drawImage(
      img,
      sel.x * scaleX, sel.y * scaleY, sel.w * scaleX, sel.h * scaleY,
      0, 0, canvas.width, canvas.height
    )
    canvas.toBlob(blob => onCrop(blob), 'image/png')
  }

  const hasSelection = sel && sel.w > 10 && sel.h > 10

  return (
    <div className="cropper-wrap">
      <p className="cropper-hint">読み取りたい部分をドラッグして選択してください</p>
      <div
        ref={containerRef}
        className="cropper-container"
        onMouseDown={onDown}
        onMouseMove={onMove}
        onMouseUp={onUp}
        onMouseLeave={onUp}
        onTouchStart={onDown}
        onTouchMove={onMove}
        onTouchEnd={onUp}
      >
        <img
          ref={imgRef}
          src={imageSrc}
          className="cropper-img"
          alt="トリミング対象"
          draggable={false}
        />
        {sel && sel.w > 2 && sel.h > 2 && (
          <div
            className="cropper-selection"
            style={{ left: sel.x, top: sel.y, width: sel.w, height: sel.h }}
          />
        )}
      </div>
      <div className="cropper-actions">
        <button className="btn-primary" onClick={handleCrop} disabled={!hasSelection}>
          この範囲を読み取る
        </button>
        <button className="btn-secondary" onClick={onSkip}>
          全体を読み取る
        </button>
      </div>
    </div>
  )
}
