import { useState } from "react"
import { FileText, Grid, Boxes } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import type { OcrResult, Line } from "@/types/ocr"
import { PlainTextTab } from "./PlainTextTab"
import { StructuredTab } from "./StructuredTab"
import { CorrectionsPanel } from "./CorrectionsPanel"

interface Correction {
  lineId: string
  originalText: string
  correctedText: string
  confidence: number
}

interface ResultPanelProps {
  result: OcrResult | null
  isLoading: boolean
  onTextUpdate?: (text: string) => void
}

export function ResultPanel({
  result,
  isLoading,
  onTextUpdate,
}: ResultPanelProps) {
  const [corrections, setCorrections] = useState<Correction[]>([])

  const handleAddToCorrections = (line: Line) => {
    if (
      corrections.some((c) => c.lineId === line.id) ||
      line.confidence >= 0.75
    ) {
      return
    }
    setCorrections((prev) => [
      ...prev,
      {
        lineId: line.id,
        originalText: line.text,
        correctedText: line.text,
        confidence: line.confidence,
      },
    ])
  }

  const handleCorrectionChange = (lineId: string, correctedText: string) => {
    setCorrections((prev) =>
      prev.map((c) =>
        c.lineId === lineId ? { ...c, correctedText } : c
      )
    )
  }

  const handleRemoveCorrection = (lineId: string) => {
    setCorrections((prev) => prev.filter((c) => c.lineId !== lineId))
  }

  const handleApplyCorrections = (appliedCorrections: Correction[]) => {
    if (!result) return

    let updatedText = result.fullText
    appliedCorrections.forEach((correction) => {
      updatedText = updatedText.replace(
        correction.originalText,
        correction.correctedText
      )
    })
    onTextUpdate?.(updatedText)
  }

  const handleTextChange = (text: string) => {
    onTextUpdate?.(text)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
        <p className="text-sm font-medium">No results yet</p>
        <p className="text-xs text-muted-foreground">
          Upload an image and click Recognize to get started
        </p>
      </div>
    )
  }

  const wordCount = result.fullText.split(/\s+/).filter((w) => w).length
  const charCount = result.fullText.length
  const avgConfidence =
    result.lines.reduce((sum, line) => sum + line.confidence, 0) /
    result.lines.length

  return (
    <div className="space-y-4">
      {/* Result Summary */}
      <div className="rounded-lg border p-4">
        <h3 className="mb-3 text-sm font-medium">Result Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Words</p>
            <p className="text-lg font-semibold">{wordCount}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Characters</p>
            <p className="text-lg font-semibold">{charCount}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Avg Confidence</p>
            <Badge
              variant={
                avgConfidence >= 0.9
                  ? "default"
                  : avgConfidence >= 0.75
                  ? "secondary"
                  : "destructive"
              }
            >
              {(avgConfidence * 100).toFixed(1)}%
            </Badge>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Num Detections</p>
            <p className="text-lg font-semibold">{result.meta.numDetections}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Confidence Score</p>
            <Badge
              variant={
                result.meta.confidence >= 0.9
                  ? "default"
                  : result.meta.confidence >= 0.75
                  ? "secondary"
                  : "destructive"
              }
            >
              {(result.meta.confidence * 100).toFixed(1)}%
            </Badge>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Processing Time</p>
            <p className="text-lg font-semibold">
              {(result.meta.processingMs / 1000).toFixed(2)}s
            </p>
          </div>
        </div>
      </div>

      {/* Processing Timings */}
      {result.meta.timings && (
        <div className="rounded-lg border p-4">
          <h3 className="mb-3 text-sm font-medium">Processing Timings</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Total Time</p>
              <p className="text-lg font-semibold">
                {(result.meta.timings.totalMs / 1000).toFixed(2)}s
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Image Preprocessing</p>
              <p className="text-lg font-semibold">
                {(result.meta.timings.imagePreprocessingMs / 1000).toFixed(2)}s
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">OCR Inference</p>
              <p className="text-lg font-semibold">
                {(result.meta.timings.ocrInferenceMs / 1000).toFixed(2)}s
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Text Postprocessing</p>
              <p className="text-lg font-semibold">
                {(result.meta.timings.textPostprocessingMs / 1000).toFixed(2)}s
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="plain" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="plain" className="gap-2">
            <FileText className="h-4 w-4" />
            Plain Text
          </TabsTrigger>
          <TabsTrigger value="structured" className="gap-2">
            <Grid className="h-4 w-4" />
            Structured
          </TabsTrigger>
          <TabsTrigger value="boxes" disabled className="gap-2">
            <Boxes className="h-4 w-4" />
            Bounding Boxes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="plain" className="mt-4">
          <PlainTextTab
            result={result}
            onTextChange={handleTextChange}
          />
        </TabsContent>

        <TabsContent value="structured" className="mt-4">
          <StructuredTab
            result={result}
            onAddToCorrections={handleAddToCorrections}
          />
        </TabsContent>

        <TabsContent value="boxes" className="mt-4">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Boxes className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-sm font-medium">Bounding Boxes Overlay</p>
            <p className="text-xs text-muted-foreground">
              This feature will display bounding boxes on the image (coming soon)
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Corrections Panel */}
      {corrections.length > 0 && (
        <div className="rounded-lg border p-4">
          <CorrectionsPanel
            corrections={corrections}
            onCorrectionChange={handleCorrectionChange}
            onRemoveCorrection={handleRemoveCorrection}
            onApplyCorrections={handleApplyCorrections}
          />
        </div>
      )}
    </div>
  )
}
