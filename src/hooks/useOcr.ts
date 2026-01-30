import { useState, useCallback } from "react"
import axios from "axios"
import type { OcrResult, OcrSettings, ApiOcrResponse } from "@/types/ocr"

interface UseOcrReturn {
  progress: number
  isProcessing: boolean
  result: OcrResult | null
  error: string | null
  processImage: (file: File, settings: OcrSettings) => Promise<void>
  reset: () => void
}

const API_BASE_URL = "http://localhost:8000"

function transformBoundingBox(bbox: number[][]): { x: number; y: number; w: number; h: number } {
  if (!bbox || bbox.length !== 4) {
    return { x: 0, y: 0, w: 0, h: 0 }
  }

  const validPoints = bbox.filter(
    (point) => Array.isArray(point) && point.length >= 2 && typeof point[0] === "number" && typeof point[1] === "number"
  )

  if (validPoints.length !== 4) {
    return { x: 0, y: 0, w: 0, h: 0 }
  }

  const xs = validPoints.map((point) => point[0])
  const ys = validPoints.map((point) => point[1])

  const x = Math.min(...xs)
  const y = Math.min(...ys)
  const w = Math.max(...xs) - x
  const h = Math.max(...ys) - y

  return { x, y, w, h }
}

function transformApiResponse(apiResponse: ApiOcrResponse, settings: OcrSettings): OcrResult {
  const lines = apiResponse.detailed_results.map((detail) => {
    const bbox = transformBoundingBox(detail.bounding_box)

    const textWords = detail.text.split(/\s+/).filter((w) => w.length > 0)
    const wordCount = textWords.length

    const words = wordCount > 0
      ? textWords.map((word, wordIndex) => ({
        text: word,
        confidence: detail.confidence,
        bbox: {
          x: bbox.w > 0 ? bbox.x + (bbox.w / wordCount) * wordIndex : bbox.x,
          y: bbox.y,
          w: bbox.w > 0 ? bbox.w / wordCount : bbox.w,
          h: bbox.h,
        },
      }))
      : [{
        text: detail.text || "",
        confidence: detail.confidence,
        bbox,
      }]

    return {
      id: String(detail.line_number),
      text: detail.text || "",
      confidence: detail.confidence,
      words,
    }
  })

  return {
    fullText: apiResponse.extracted_text || "",
    lines,
    meta: {
      processingMs: apiResponse.timings.total_ms,
      language: apiResponse.model_info.language,
      model: apiResponse.model_info.engine,
      rotated: apiResponse.model_info.use_angle_cls,
      denoised: false,
    },
  }
}

export function useOcr(): UseOcrReturn {
  const [progress, setProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<OcrResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const processImage = useCallback(async (file: File, settings: OcrSettings) => {
    setIsProcessing(true)
    setProgress(0)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("lang", settings.language)

      const apiResponse: ApiOcrResponse = await axios.post(
        `${API_BASE_URL}/ocr/upload`,
        formData,
        {
          onUploadProgress: (progressEvent: { loaded: number; total?: number }) => {
            if (progressEvent.total) {
              // Track upload progress up to 90%, remaining 10% for processing
              const percentCompleted = Math.round(
                (progressEvent.loaded * 90) / progressEvent.total
              )
              setProgress(percentCompleted)
            }
          },
        }
      ).then((response) => {
        setProgress(100)
        return response.data
      })

      if (!apiResponse.success) {
        throw new Error(apiResponse.message || "OCR processing failed")
      }

      const transformedResult = transformApiResponse(apiResponse, settings)
      setResult(transformedResult)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          `API error: ${err.response?.status || "Unknown"}`
        setError(errorMessage)
      } else {
        setError(err instanceof Error ? err.message : "Unknown error occurred")
      }
      setProgress(0)
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
