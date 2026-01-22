import { useState } from "react"
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ImagePreviewProps {
  imageUrl: string
  disabled?: boolean
}

export function ImagePreview({ imageUrl, disabled }: ImagePreviewProps) {
  const [zoom, setZoom] = useState(1)
  const [fit, setFit] = useState(true)

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

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Image Preview</h3>
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
      <div className="relative overflow-hidden rounded-lg border bg-muted/50">
        <div
          className="flex items-center justify-center overflow-auto p-4"
          style={{ minHeight: "300px", maxHeight: "500px" }}
        >
          <img
            src={imageUrl}
            alt="Preview"
            className={cn(
              "transition-transform",
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
          <div className="absolute bottom-2 right-2 rounded bg-black/50 px-2 py-1 text-xs text-white">
            {Math.round(zoom * 100)}%
          </div>
        )}
      </div>
    </div>
  )
}
