import { useRef, useState } from 'react'
import { recognizeImage } from '../utils/ocr'

async function normalizeToJpeg(file) {
  const name = file.name.toLowerCase()
  const isHeic = file.type === 'image/heic' || file.type === 'image/heif'
    || name.endsWith('.heic') || name.endsWith('.heif')
  if (!isHeic) return file

  // Dynamically import heic2any to avoid bundle bloat when not needed
  const heic2any = (await import('heic2any')).default
  const blob = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.9 })
  // heic2any may return array for multi-frame
  const single = Array.isArray(blob) ? blob[0] : blob
  return new File([single], name.replace(/\.hei[cf]$/i, '.jpg'), { type: 'image/jpeg' })
}

export default function ImageCapture({ onTextReady }) {
  const [preview, setPreview] = useState(null)
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const fileRef = useRef()
  const cameraRef = useRef()

  async function handleImage(file) {
    if (!file) return
    setError(null)
    setLoading(true)
    setProgress(0)

    try {
      const normalized = await normalizeToJpeg(file)
      const url = URL.createObjectURL(normalized)
      setPreview(url)
      const text = await recognizeImage(normalized, setProgress)
      onTextReady(text)
    } catch (e) {
      console.error(e)
      setError('OCRに失敗しました。画像を確認してください。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="image-capture">
      <div className="image-capture-buttons">
        <button className="btn-secondary" onClick={() => fileRef.current.click()}>
          📁 ファイルを選択
        </button>
        <button className="btn-secondary" onClick={() => cameraRef.current.click()}>
          📷 カメラで撮影
        </button>
        {/* Accepts png/jpg/heic/heif */}
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/heic,image/heif,.heic,.heif"
          style={{ display: 'none' }}
          onChange={e => handleImage(e.target.files[0])}
        />
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: 'none' }}
          onChange={e => handleImage(e.target.files[0])}
        />
      </div>

      {preview && (
        <div className="image-preview-wrap">
          <img src={preview} alt="撮影画像" className="image-preview" />
        </div>
      )}

      {loading && (
        <div className="ocr-progress">
          <div className="ocr-progress-bar" style={{ width: `${progress}%` }} />
          <span>{progress < 5 ? 'HEIC変換中…' : `文字認識中… ${progress}%`}</span>
        </div>
      )}

      {error && <p className="ocr-error">{error}</p>}
    </div>
  )
}
