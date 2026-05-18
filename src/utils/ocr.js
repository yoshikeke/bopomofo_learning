import Tesseract from 'tesseract.js'

// Preprocess image: grayscale + contrast boost + 2× upscale
function preprocessImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      const scale = 2
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth * scale
      canvas.height = img.naturalHeight * scale
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)

      const id = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const d = id.data
      // 1.3 is more conservative than 1.8 — aggressive contrast destroys thin strokes
      const contrast = 1.3
      for (let i = 0; i < d.length; i += 4) {
        const gray = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]
        const v = Math.min(255, Math.max(0, contrast * (gray - 128) + 128))
        d[i] = d[i + 1] = d[i + 2] = v
      }
      ctx.putImageData(id, 0, 0)

      canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('canvas toBlob failed')), 'image/png')
    }

    img.onerror = reject
    img.src = url
  })
}

function isAllowedChar(cp) {
  return (
    (cp >= 0x4e00 && cp <= 0x9fff) ||   // CJK Unified Ideographs
    (cp >= 0x3400 && cp <= 0x4dbf) ||   // CJK Extension A
    (cp >= 0xf900 && cp <= 0xfaff) ||   // CJK Compatibility Ideographs
    (cp >= 0x3000 && cp <= 0x303f) ||   // CJK Symbols & Punctuation
    (cp >= 0xff01 && cp <= 0xff5e)       // Fullwidth punctuation
  )
}

function filterChinese(text) {
  return Array.from(text).filter(ch => isAllowedChar(ch.codePointAt(0))).join('')
}

export async function recognizeImage(imageSource, onProgress, { vertical = false } = {}) {
  let source = imageSource
  if (imageSource instanceof Blob) {
    try {
      source = await preprocessImage(imageSource)
    } catch {
      source = imageSource
    }
  }

  const worker = await Tesseract.createWorker(['chi_tra', 'eng'], 1, {
    logger: m => {
      if (m.status === 'recognizing text' && onProgress) {
        onProgress(Math.round(m.progress * 100))
      }
    },
  })

  await worker.setParameters({
    tessedit_pageseg_mode: vertical ? '5' : '6', // 5=SINGLE_BLOCK_VERT_TEXT, 6=SINGLE_BLOCK
  })

  const result = await worker.recognize(source)
  await worker.terminate()

  return filterChinese(result.data.text)
}
