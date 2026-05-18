import { useRef, useState } from 'react'
import { recognizeImage } from '../utils/ocr'
import ImageCropper from './ImageCropper'

async function normalizeToJpeg(file) {
  const name = file.name.toLowerCase()
  const isHeic = file.type === 'image/heic' || file.type === 'image/heif'
    || name.endsWith('.heic') || name.endsWith('.heif')
  if (!isHeic) return file

  const heic2any = (await import('heic2any')).default
  const blob = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.9 })
  const single = Array.isArray(blob) ? blob[0] : blob
  return new File([single], name.replace(/\.hei[cf]$/i, '.jpg'), { type: 'image/jpeg' })
}

export default function ImageCapture({ onTextReady }) {
  const [previewUrl, setPreviewUrl] = useState(null)
  const [showCropper, setShowCropper] = useState(false)
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [vertical, setVertical] = useState(false)
  const normalizedRef = useRef(null)
  const fileRef = useRef()
  const cameraRef = useRef()

  async function handleFile(file) {
    if (!file) return
    setError(null)
    setLoading(false)
    setProgress(0)

    try {
      const normalized = await normalizeToJpeg(file)
      normalizedRef.current = normalized
      const url = URL.createObjectURL(normalized)
      setPreviewUrl(url)
      setShowCropper(true)
    } catch (e) {
      console.error(e)
      setError('画像の読み込みに失敗しました。')
    }
  }

  async function runOcr(source) {
    setShowCropper(false)
    setLoading(true)
    setProgress(0)
    try {
      const text = await recognizeImage(source, setProgress, { vertical })
      onTextReady(text)
    } catch (e) {
      console.error(e)
      setError('OCRに失敗しました。画像を確認してください。')
    } finally {
      setLoading(false)
    }
  }

  function handleCrop(blob) {
    const croppedFile = new File([blob], 'cropped.png', { type: 'image/png' })
    const url = URL.createObjectURL(blob)
    setPreviewUrl(url)
    runOcr(croppedFile)
  }

  function handleSkip() {
    runOcr(normalizedRef.current)
  }

  function handleReset() {
    setPreviewUrl(null)
    setShowCropper(false)
    setError(null)
    normalizedRef.current = null
  }

  return (
    <div className="image-capture">
      <div className="ocr-direction-toggle">
        <button
          className={`btn-secondary ${!vertical ? 'btn-secondary--active' : ''}`}
          onClick={() => setVertical(false)}
        >
          横書き
        </button>
        <button
          className={`btn-secondary ${vertical ? 'btn-secondary--active' : ''}`}
          onClick={() => setVertical(true)}
        >
          縦書き
        </button>
      </div>

      {!showCropper && (
        <div className="image-capture-buttons">
          <button className="btn-secondary" onClick={() => cameraRef.current.click()}>
            📷 カメラで撮影
          </button>
          <button className="btn-secondary" onClick={() => fileRef.current.click()}>
            📁 ファイルを選択
          </button>
          
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/heic,image/heif,.heic,.heif"
            style={{ display: 'none' }}
            onChange={e => { handleFile(e.target.files[0]); e.target.value = '' }}
          />
          <input
            ref={cameraRef}
            type="file"
            accept="image/*"
            capture="environment"
            style={{ display: 'none' }}
            onChange={e => { handleFile(e.target.files[0]); e.target.value = '' }}
          />
        </div>
      )}

      {showCropper && previewUrl && (
        <ImageCropper
          imageSrc={previewUrl}
          onCrop={handleCrop}
          onSkip={handleSkip}
        />
      )}

      {!showCropper && previewUrl && !loading && (
        <>
          <div className="image-preview-wrap">
            <img src={previewUrl} alt="処理済み画像" className="image-preview" />
          </div>
          
        </>
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
