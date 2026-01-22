import { useState, useCallback } from "react"
import type { OcrResult, OcrSettings } from "@/types/ocr"
import { mockOcrResults } from "@/data/mockOcrData"

interface UseMockOcrReturn {
  progress: number
  isProcessing: boolean
  result: OcrResult | null
  error: string | null
  processImage: (settings: OcrSettings) => Promise<void>
  reset: () => void
}

export function useMockOcr(): UseMockOcrReturn {
  const [progress, setProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<OcrResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const processImage = useCallback(async (settings: OcrSettings) => {
    setIsProcessing(true)
    setProgress(0)
    setError(null)
    setResult(null)

    // Simulate progress (0-100% in ~2.5s)
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 2
      })
    }, 50)

    try {
      // Simulate 10% failure rate
      const shouldFail = Math.random() < 0.1

      await new Promise((resolve, reject) => {
        setTimeout(() => {
          clearInterval(progressInterval)
          setProgress(100)
          if (shouldFail) {
            reject(new Error("OCR processing failed. Please try again."))
          } else {
            resolve(null)
          }
        }, 2500)
      })

      // Select a random mock result based on language
      const languageResults = mockOcrResults.filter(
        (r) => r.meta.language === settings.language
      )
      const selectedResult =
        languageResults.length > 0
          ? languageResults[Math.floor(Math.random() * languageResults.length)]
          : mockOcrResults[Math.floor(Math.random() * mockOcrResults.length)]

      // Update result with settings
      const finalResult: OcrResult = {
        ...selectedResult,
        meta: {
          ...selectedResult.meta,
          language: settings.language,
          model: settings.model,
          rotated: settings.autoRotate,
          denoised: settings.denoise,
        },
      }

      setResult(finalResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setIsProcessing(false)
    }
  }, [])

  const reset = useCallback(() => {
    setProgress(0)
    setIsProcessing(false)
    setResult(null)
    setError(null)
  }, [])

  return {
    progress,
    isProcessing,
    result,
    error,
    processImage,
    reset,
  }
}
