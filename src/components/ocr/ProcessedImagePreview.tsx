import { useState, useEffect } from "react"
import { ZoomIn, ZoomOut, Maximize2, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { OcrResult } from "@/types/ocr"

interface ProcessedImagePreviewProps {
  imageUrl: string
  result: OcrResult | null
  disabled?: boolean
}

export function ProcessedImagePreview({
  imageUrl,
  result,
  disabled
}: ProcessedImagePreviewProps) {
  const [zoom, setZoom] = useState(1)
  const [fit, setFit] = useState(true)
  const [imageInfo, setImageInfo] = useState<{ width: number; height: number } | null>(null)
  const [showInfo, setShowInfo] = useState(false)

  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      setImageInfo({
        width: img.naturalWidth,
        height: img.naturalHeight
      })
    }
    img.src = imageUrl
  }, [imageUrl])

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3))
    setFit(false)
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5))
    setFit(false)
  }

  const handleFit = () => {
    setFit(true)
    setZoom(1)
  }

  if (!result) {
    return null
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">Processed Image</h3>
          {imageInfo && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setShowInfo(!showInfo)}
              title="Image information"
            >
              <Info className="h-3 w-3" />
            </Button>
          )}
        </div>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomOut}
            disabled={disabled || zoom <= 0.5}
            aria-label="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleFit}
            disabled={disabled}
            aria-label="Fit to screen"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomIn}
            disabled={disabled || zoom >= 3}
            aria-label="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="relative overflow-hidden rounded-lg border bg-muted/50 shadow-lg">
        <div
          className="flex items-center justify-center overflow-auto p-4"
          style={{ minHeight: "300px", maxHeight: "500px" }}
        >
          <img
            src={imageUrl}
            alt="Processed Preview"
            className={cn(
              "transition-transform duration-300",
              fit ? "max-w-full max-h-full object-contain" : ""
            )}
            style={
              !fit
                ? {
                  transform: `scale(${zoom})`,
                  transformOrigin: "center",
                }
                : undefined
            }
          />
        </div>
        {!fit && (
          <div className="absolute bottom-2 right-2 rounded-lg bg-black/70 backdrop-blur-sm px-2 py-1 text-xs text-white shadow-lg">
            {Math.round(zoom * 100)}%
          </div>
        )}
      </div>
      {showInfo && imageInfo && (
        <div className="rounded-lg border bg-card p-3 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-muted-foreground">Size: </span>
              <span className="font-medium">{imageInfo.width} × {imageInfo.height} px</span>
            </div>
            <div>
              <span className="text-muted-foreground">Detections: </span>
              <span className="font-medium">{result.lines.length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
