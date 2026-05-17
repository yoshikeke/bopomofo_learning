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
    const containerRect = containerRef.current.getBoundingClientRect()

    // object-fit: contain での実際の描画領域を計算
    // getBoundingClientRect() は object-fit の内部オフセットを反映しないため手動計算が必要
    const naturalAspect = img.naturalWidth / img.naturalHeight
    const containerAspect = containerRect.width / containerRect.height

    let renderWidth, renderHeight, offsetX, offsetY
    if (naturalAspect > containerAspect) {
      renderWidth = containerRect.width
      renderHeight = containerRect.width / naturalAspect
      offsetX = 0
      offsetY = (containerRect.height - renderHeight) / 2
    } else {
      renderHeight = containerRect.height
      renderWidth = containerRect.height * naturalAspect
      offsetX = (containerRect.width - renderWidth) / 2
      offsetY = 0
    }

    const scaleX = img.naturalWidth / renderWidth
    const scaleY = img.naturalHeight / renderHeight
    const sx = Math.max(0, (sel.x - offsetX) * scaleX)
    const sy = Math.max(0, (sel.y - offsetY) * scaleY)
    const sw = Math.min(img.naturalWidth - sx, sel.w * scaleX)
    const sh = Math.min(img.naturalHeight - sy, sel.h * scaleY)
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(sw)
    canvas.height = Math.round(sh)
    canvas.getContext('2d').drawImage(
      img,
      sx, sy, sw, sh,
      0, 0, canvas.width, canvas.height
    )
    canvas.toBlob(blob => {
      // DEBUG: クロップ結果を新しいタブで表示
      
      onCrop(blob)
    }, 'image/png')
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
